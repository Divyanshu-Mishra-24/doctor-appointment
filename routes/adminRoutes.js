const express = require('express');
const { getAllUsersController, getAllDoctorsController, changeAccountStatus } = require('../controllers/adminCtrl');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); 

const router = express.Router();

// FIXED: Add adminMiddleware after authMiddleware
//get method || Users
router.get('/getAllUsers', authMiddleware, adminMiddleware, getAllUsersController);

//get method || Doctors  
router.get('/getAllDoctors', authMiddleware, adminMiddleware, getAllDoctorsController);

//post account status
router.post('/changeAccountStatus',authMiddleware,changeAccountStatus)

module.exports = router;