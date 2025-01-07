const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'secretekey';
const accessTokenExpiry = '15m';
const refreshTokenExpiry = '1m';

// Generate JWT token
const generateAccessToken = (uid, role) => {
    return jwt.sign({ _id: uid, role }, secret, { expiresIn: accessTokenExpiry });
}
const generateRefreshToken = (uid) => {
    return jwt.sign({ _id: uid }, secret, { expiresIn: refreshTokenExpiry });
}

module.exports = { generateAccessToken, generateRefreshToken };