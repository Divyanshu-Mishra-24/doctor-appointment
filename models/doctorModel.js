const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    f_name: {
        type: String,
        required: [true, 'First name is required']
    },
    l_name: {
        type: String,
        required: [true, 'Last name is required']
    },
    phone_no: {
        type: String,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    specialization: {
        type: String,
        required: [true, 'Area of specialization is required']
    },
    experience: {
        type: String,
        required: [true, 'Experience is required']
    },
    feePerConsulatation: {
        type: Number,
        required: [true, 'Consultation fee is required']
    },
    status: {
         type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'approved' // Change from 'pending' to 'approved'
    },
    timings: {
        type: [String], // store as ['09:00 AM', '05:00 PM']
        required: [true, 'Work timing is required']
    }
}, { timestamps: true });

const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;
