const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => { 
    const { firstname, lastname, email, password } = req.body;
    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        });
    }
    const response = await User.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        data: response
    });
})

module.exports = {
    registerUser
}