const doctorModel = require('../models/doctorModel')
const userModel = require('../models/userModel')

const getAllUsersController = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.body.userId);

        if (!currentUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        if (!currentUser.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access - Admin privileges required',
            });
        }

        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            message: "User Data List:",
            data: users,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while fetching user data',
            error,
        });
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.body.userId);

        if (!currentUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        if (!currentUser.isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access - Admin privileges required',
            });
        }

        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "Doctors Data List:",
            data: doctors,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while fetching doctors data',
            error,
        });
    }
}

// THE MAIN FIX - Doctor Account Status
const changeAccountStatus = async (req, res) => {
    try {
        console.log("🔍 Request body:", req.body);
        
        const { doctorId, status } = req.body;
        
        if (!doctorId || !status) {
            return res.status(400).send({
                success: false,
                message: 'Doctor ID and status are required',
            });
        }

        // Step 1: Find and update doctor document
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId, 
            { status }, 
            { new: true }
        );

        if (!doctor) {
            console.log("❌ Doctor not found with ID:", doctorId);
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        console.log("✅ Doctor updated:", {
            id: doctor._id,
            userId: doctor.userId,
            status: doctor.status
        });

        // Step 2: Find the user associated with this doctor application
        // The doctor.userId should match the user's _id
        const targetUser = await userModel.findById(doctor.userId);
        
        if (!targetUser) {
            console.log("❌ User not found with ID:", doctor.userId);
            return res.status(404).send({
                success: false,
                message: 'Associated user not found',
            });
        }

        console.log("🔍 Found target user:", {
            id: targetUser._id,
            name: targetUser.f_name,
            currentIsDoctor: targetUser.isDoctor
        });

        // Step 3: Update user's isDoctor status and add notification
        const updatedUser = await userModel.findByIdAndUpdate(
            doctor.userId,
            {
                $set: {
                    isDoctor: status === 'approved'
                },
                $push: {
                    notification: {
                        type: 'doctor-account-request-update',
                        message: `Your Doctor Account Request has been ${status}`,
                        onClickPath: '/notification',
                        read: false
                    }
                }
            },
            { new: true }
        );

        console.log("✅ User updated successfully:", {
            id: updatedUser._id,
            name: updatedUser.f_name,
            isDoctor: updatedUser.isDoctor,
            notificationCount: updatedUser.notification.length
        });

        // Step 4: Verify the update worked
        const verifyUser = await userModel.findById(doctor.userId);
        console.log("🔍 Verification - User isDoctor status:", verifyUser.isDoctor);

        res.status(200).send({
            success: true,
            message: `Account Status Updated to ${status}`,
            data: {
                doctor: doctor,
                userUpdated: {
                    userId: updatedUser._id,
                    isDoctor: updatedUser.isDoctor
                }
            },
        });

    } catch (error) {
        console.log("❌ FULL ERROR in changeAccountStatus:", error);
        res.status(500).send({
            success: false,
            message: 'Error in Account Status Update',
            error: error.message,
        });
    }
}


module.exports = {
    getAllDoctorsController,
    getAllUsersController,
    changeAccountStatus
}