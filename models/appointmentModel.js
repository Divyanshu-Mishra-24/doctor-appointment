const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: 'doctors', // Reference to doctors model
        required: true
    },
    doctorInfo: {
        type: Object,
    },
    userInfo: {
        type: Object,
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    }
}, { timestamps: true });

const appointmentModel = mongoose.model('appointments', appointmentSchema)
module.exports = appointmentModel