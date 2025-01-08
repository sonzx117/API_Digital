const jwt = require('jsonwebtoken');
require('dotenv').config();
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Required authentication'
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid accesstoken'
            });
        }
        req.user = user;
        next();
    });
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Authorization required'
        })
    }
    else {
        next()
    }
})
module.exports = {
    verifyAccessToken,
    isAdmin
};