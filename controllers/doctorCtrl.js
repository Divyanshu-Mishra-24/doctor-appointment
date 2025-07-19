const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const userModel = require('../models/userModel')
const InfoModel = require('../models/InfoModel') // Add InfoModel import

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });

        res.status(200).send({
            success: true,
            message: 'Doctor info fetched successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching doctor details',
            error: error.message
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId },
            req.body,
            { new: true }
        )
        await userModel.findByIdAndUpdate(req.body.userId, { profileComplete: true });
        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating profile'
        });
    }
};

const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: 'Single Doctor info fetched',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in single doc info'
        });
    }
}

//Doctor Appointments controller 
const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });

        const appointments = await appointmentModel.find({ doctorId: doctor._id }).populate('userId', 'f_name l_name email');
        res.status(200).send({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.log('Error in doctorAppointmentController:', error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error in fetching doctor appointments'
        });
    }
}

//update status controller 
const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentId, { status })
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification
        notification.push(
            {
                type: "Status Updated",
                message: 'Your Appointment Status Have Been Updated , Check Now!!',
                onClickPath: '/doctor-appointments'
            }
        )
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Appointments Status Changed successfully',
        });
    } catch (error) {
        console.log('Error in doctorAppointmentController:', error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error in fetching doctor appointments'
        });
    }
}

// Get additional information by doctor ID
const getAdditionalInfoController = async (req, res) => {
    try {
        const { id } = req.params; // Get doctor ID from params
        const userId = req.body.userId; // Get authenticated user ID

        // First check if the doctor exists and belongs to the authenticated user
        const doctor = await doctorModel.findOne({ _id: id, userId: userId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or access denied'
            });
        }

        // Get additional info from InfoModel
        const additionalInfo = await InfoModel.findOne({ userId: userId })
            .select('-__v -createdAt -updatedAt')
            .lean();

        if (!additionalInfo) {
            return res.status(404).json({
                success: false,
                message: 'Additional information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Additional information fetched successfully',
            data: additionalInfo
        });
    } catch (error) {
        console.error('Error in getAdditionalInfoController:', error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching additional information',
            error: error.message
        });
    }
};

// Create additional information for a doctor
const createAdditionalInfoController = async (req, res) => {
    try {
        const { id } = req.params; // Get doctor ID from params
        const userId = req.body.userId; // Get authenticated user ID

        // First check if the doctor exists and belongs to the authenticated user
        const doctor = await doctorModel.findOne({ _id: id, userId: userId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or access denied'
            });
        }

        // Check if additional info already exists
        const existingInfo = await InfoModel.findOne({ userId: userId });
        
        if (existingInfo) {
            return res.status(400).json({
                success: false,
                message: 'Additional information already exists. Use PUT to update.'
            });
        }

        // Create new additional info
        const additionalInfo = new InfoModel({
            userId: userId,
            ...req.body
        });

        await additionalInfo.save();

        res.status(201).json({
            success: true,
            message: 'Additional information created successfully',
            data: additionalInfo
        });
    } catch (error) {
        console.error('Error in createAdditionalInfoController:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error in creating additional information',
            error: error.message
        });
    }
};

// Update additional information for a doctor
const updateAdditionalInfoController = async (req, res) => {
    try {
        const { id } = req.params; // Get doctor ID from params
        const userId = req.body.userId; // Get authenticated user ID

        // First check if the doctor exists and belongs to the authenticated user
        const doctor = await doctorModel.findOne({ _id: id, userId: userId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or access denied'
            });
        }

        // Update additional info
        const updatedInfo = await InfoModel.findOneAndUpdate(
            { userId: userId },
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedInfo) {
            return res.status(404).json({
                success: false,
                message: 'Additional information not found'
            });
        }
        await userModel.findByIdAndUpdate(req.body.userId, { infoComplete: true });
        res.status(200).json({
            success: true,
            message: 'Additional information updated successfully',
            data: updatedInfo
        });
    } catch (error) {
        console.error('Error in updateAdditionalInfoController:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error in updating additional information',
            error: error.message
        });
    }
};

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentController,
    updateStatusController,
    getAdditionalInfoController,
    createAdditionalInfoController,
    updateAdditionalInfoController
}