const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    l_name: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    // Additional profile fields
    age: {
        type: Number,
        min: 1,
        max: 120
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
     profileComplete: {
        type: Boolean,
        default: false
    },
    infoComplete: {
        type: Boolean,
        default: false
    },
    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[]
    }

}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;