const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')
const multer = require('multer');
const fs = require('fs');
const util=require('util')
const path = require('path');

//register contorller
const registerController = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log

    // ✅ FIXED: Match frontend field names
    const { f_name, l_name, email, passwd } = req.body;

    // ✅ FIXED: Check for correct field names
    if (!f_name || !l_name || !email || !passwd) {
      return res.status(400).send({
        success: false,
        message: 'First name, last name, email, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwd, salt); // ✅ FIXED: Use 'passwd' instead of 'password'

    // Create new user with field names
    const newUser = new userModel({
      f_name,
      l_name,
      email,
      password: hashedPassword, // Store as 'password' in database
    });

    await newUser.save();
    console.log('User saved successfully:', newUser.email); // Debug log

    res.status(201).send({
      success: true,
      message: 'Registration successful',
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};

//login controller
const loginController = async (req, res) => {
  try {
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt for:', req.body.email);

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      console.log("❌ User not found:", req.body.email);
      return res.status(200).send({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User found:', user.email);
    console.log('User isAdmin:', user.isAdmin);
    console.log('User isDoctor:', user.isDoctor);

    const isMatch = await bcrypt.compare(req.body.passwd, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", req.body.email);
      return res.status(200).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('✅ Password match successful');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('✅ Token generated successfully');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');
    console.log('=== END LOGIN DEBUG ===');

    res.status(200).send({
      message: "Login Successful",
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).send({
      success: false,
      message: `Login Controller Error: ${error.message}`,
    });
  }
};

//authorization contoller
const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.password = undefined;
    if (!user) {
      return res.status(200).send(
        {
          message: 'user not found',
          success: false
        }
      )
    }
    else {
      res.status(200).send({
        success: true,
        data: user
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'Auth error',
      success: false,
      error
    })
  }
}

//apply doctor contoller 
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
    await newDoctor.save()
    const adminUser = await userModel.findOne({ isAdmin: true })
    const notification = adminUser.notification
    notification.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.f_name} ${newDoctor.l_name} has applied for Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.f_name + " " + newDoctor.l_name,
        onCLickPath: '/admin/doctors'
      }
    })
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: 'Doctor Account Applied Successfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'Error while Applying for Doctor'
    })
  }
}

//notification contorller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    // Create a new array combining existing and new notifications
    const updatedSeenNotifications = [
      ...user.seennotification,
      ...user.notification
    ];

    // Update user and save
    user.seennotification = updatedSeenNotifications;
    user.notification = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Notifications marked as read',
      data: {
        notifications: user.notification, // Now empty
        seenNotifications: user.seennotification // Contains all
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error processing notifications',
      error: error.message
    });
  }
};

//Delete notification
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.notification = []
    user.seennotification = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send
      ({
        success: true,
        message: "Notification deleted",
        data: updatedUser
      })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Enable to Delete all Notifications',
      error: error.message
    });
  }
}

//get all doctor 
const getAllDoctorController = async (req, res) => {
  try {
    const doctor = await doctorModel.find({ status: 'approved' })
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctor
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Enable to get all doctors',
      error: error.message
    });
  }
}

//book appointment controller
//book appointment controller
const bookAppointmentController = async (req, res) => {
  try {
    // First, check availability before booking
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
    const doctorId = req.body.doctorId;

    console.log("📅 Booking request with availability check:", {
      originalDate: req.body.date,
      originalTime: req.body.time,
      date,
      fromTime,
      toTime,
      doctorId
    });

    // Check for existing appointments (including pending ones)
    const existingAppointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime
      },
      status: { $in: ['pending', 'approved'] } // Check both pending and approved
    });

    if (existingAppointments.length > 0) {
      console.log("❌ Slot already booked:", existingAppointments.length, "appointments found");
      return res.status(200).send({
        success: false,
        message: "Appointment slot is already booked. Please choose a different time."
      });
    }

    // If available, proceed with booking
    req.body.date = date;
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();
    req.body.status = 'pending';
    
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    
    // Send notification to doctor
    const doctorUser = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    if (doctorUser) {
      doctorUser.notification.push({
        type: 'New Appointment Request',
        message: `New Appointment Request from ${req.body.userInfo.f_name}`,
        onCLickPath: '/doctor/appointments'
      });
      await doctorUser.save();
    }
    
    console.log("✅ Appointment booked successfully");
    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully! Doctor will confirm shortly.",
      data: newAppointment
    });
    
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).send({
      success: false,
      message: 'Error while booking appointment',
      error: error.message
    });
  }
}

//Booking Availablity Controller
const bookingAvailablityController = async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
    const doctorId = req.body.doctorId;

    console.log("🔍 Availability check:", {
      date,
      fromTime,
      toTime,
      doctorId
    });

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime
      }
    });

    console.log("📋 Found appointments:", appointments.length);

    if (appointments.length > 0) {
      return res.status(200).send({
        message: 'Appointment not available at this time',
        success: true,
        available: false
      });
    } else {
      return res.status(200).send({
        message: 'Appointment slot available',
        success: true,
        available: true
      });
    }
  } catch (error) {
    console.error("❌ Availability check error:", error);
    res.status(500).send({
      success: false,
      message: 'Error while checking availability',
      error: error.message
    });
  }
}

//user appointment controller
const userAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({userId: req.body.userId})
      .populate('doctorId') // This will populate the doctor details
      
    res.status(200).send({
      success: true,
      message: 'User appointment fetched successfully', 
      data: appointments
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching appointments',
      error: error.message
    });
  }
}

//update profile controller
const updateProfileController = async (req, res) => {
  try {
    console.log("Received update request with body:", req.body);
    
    const { 
      f_name, 
      l_name, 
      email, 
      age, 
      phone, 
      address, 
      gender, 
      dateOfBirth, 
      bio,
      userId 
    } = req.body;

    // Validate required fields
    if (!userId) {
      console.log("No userId provided");
      return res.status(400).send({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare update data
    const updateData = {};
    if (f_name !== undefined) updateData.f_name = f_name;
    if (l_name !== undefined) updateData.l_name = l_name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (bio !== undefined) updateData.bio = bio;

    console.log("Data to update:", updateData);

    // Check if there's actually data to update
    if (Object.keys(updateData).length === 0) {
      console.log("No fields to update");
      return res.status(400).send({
        success: false,
        message: 'No fields to update'
      });
    }

    // Email uniqueness check
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await userModel.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      if (emailExists) {
        console.log("Email already exists:", updateData.email);
        return res.status(400).send({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Perform update
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    console.log("Updated user:", updatedUser);

    res.status(200).send({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).send({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

//Profile Picture COntroller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profile_pics';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export the multer middleware for use in routes
const uploadMiddleware = upload.single('profilePicture');

// Controller function
const uploadProfilePictureController = async (req, res) => {
  try {
    console.log('✅ [uploadProfilePictureController] File:', req.file);
    console.log('✅ [uploadProfilePictureController] Body:', req.body);

    const { userId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Create the path that will be stored in database
    const imagePath = `/uploads/profile_pics/${req.file.filename}`;

    // Update user in database
    const user = await userModel.findByIdAndUpdate(
      userId,
      { profilePicture: imagePath },
      { new: true }
    );

    if (!user) {
      // Delete the uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { 
        profilePicture: imagePath,
        user: user 
      },
    });
  } catch (err) {
    console.error('Error in uploadProfilePictureController:', err);
    
    // Delete the uploaded file if there's an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong during upload' 
    });
  }
};

// Get user by ID controller
const getUserByIdController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).send({
      success: true,
      message: 'User fetched successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorController,
  bookAppointmentController,
  bookingAvailablityController,
  userAppointmentController,
  updateProfileController,
  uploadProfilePictureController,
  uploadMiddleware,
  getUserByIdController
};