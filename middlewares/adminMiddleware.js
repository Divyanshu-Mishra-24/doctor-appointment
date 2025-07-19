const userModel = require('../models/userModel');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.body.userId);
        
        if (!user) {
            return res.status(404).send({
                message: "User not found",
                success: false
            });
        }
        
        if (!user.isAdmin) {
            return res.status(403).send({
                message: "Unauthorized access - Admin privileges required",
                success: false
            });
        }
        
        next();
    } catch (error) {
        console.log('Admin middleware error:', error);
        res.status(500).send({
            message: 'Server error in admin verification',
            success: false
        });
    }
};

module.exports = adminMiddleware;