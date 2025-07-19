const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { 
    getDoctorInfoController, 
    updateProfileController, 
    getDoctorByIdController, 
    doctorAppointmentController, 
    updateStatusController,
    getAdditionalInfoController,
    createAdditionalInfoController,
    updateAdditionalInfoController 
} = require('../controllers/doctorCtrl')

const router = express.Router()

//post single doc info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

// post update profile
router.post('/updateProfile', authMiddleware, updateProfileController)

//post get single doc info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//get doctor appointments
router.get('/doctor-appointment', authMiddleware, doctorAppointmentController)

//POST update status
router.post('/update-status', authMiddleware, updateStatusController)

//Information
router.get('/info/:id', authMiddleware, getAdditionalInfoController);
router.post('/info/:id', authMiddleware, createAdditionalInfoController);
router.put('/info/:id', authMiddleware, updateAdditionalInfoController);


module.exports = router