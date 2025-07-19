const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        console.log('=== AUTH MIDDLEWARE DEBUG ===');
        console.log('Request URL:', req.originalUrl);
        console.log('Request Method:', req.method);

        const authHeader = req.headers['authorization'];
        console.log('Authorization Header:', authHeader);
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('JWT_SECRET preview:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : 'MISSING');

        if (!authHeader) {
            console.log('❌ No authorization header found');
            return res.status(401).send({
                message: "No token provided",
                success: false
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.log('❌ Invalid authorization format:', authHeader);
            return res.status(401).send({
                message: "Invalid authorization format. Expected: Bearer <token>",
                success: false
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            console.log('❌ No token found after Bearer');
            return res.status(401).send({
                message: "No token found",
                success: false
            });
        }

        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');

        if (!process.env.JWT_SECRET) {
            console.log('❌ JWT_SECRET is missing from environment variables');
            return res.status(500).send({
                message: "Server configuration error",
                success: false
            });
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('❌ JWT Verification failed:', err.name, err.message);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({
                        message: "Token expired",
                        success: false
                    });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({
                        message: "Invalid token",
                        success: false
                    });
                } else {
                    return res.status(401).send({
                        message: "Auth Failed: " + err.message,
                        success: false
                    });
                }
            } else {
                console.log('✅ Token verified successfully');
                console.log('Decoded user ID:', decoded.id);

                if (!req.body) req.body = {};
                req.body.userId = decoded.id;

                console.log('=== END AUTH MIDDLEWARE DEBUG ===');
                next();
            }
        });
    } catch (error) {
        console.log('❌ Auth Middleware Exception:', error);
        res.status(401).send({
            message: 'Auth Failed: ' + error.message,
            success: false
        });
    }
};
