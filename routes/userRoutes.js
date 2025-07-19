const express = require('express');

const router=express.Router();
const { loginController, registerController, authController ,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailablityController, userAppointmentController,updateProfileController,uploadProfilePictureController,uploadMiddleware,getUserByIdController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//routes
//register
router.post('/register',registerController)

//login
router.post('/login',loginController)

//Auth
router.post('/getUserData',authMiddleware,authController)

//Apply Docotor
router.post('/apply-doctor',authMiddleware,applyDoctorController)

//Notification Docotor
router.post('/get-all-notification',authMiddleware,getAllNotificationController)

//Delete Notification for Doctors
router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController)

//get all doctors
router.get('/getAllDoctors',authMiddleware,getAllDoctorController)

//book appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController)

//Booking Availablity
router.post('/booking-availablity',authMiddleware,bookingAvailablityController)

//user appointment
router.get('/user-appointments',authMiddleware,userAppointmentController)

//update profile
router.put('/update-profile',authMiddleware,updateProfileController)

//upload Profile Pic
router.post('/upload-profile-picture',authMiddleware,uploadMiddleware,uploadProfilePictureController)

router.get('/:id', authMiddleware, getUserByIdController);

module.exports=router;
