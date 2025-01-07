const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => { 
    const { firstname, lastname, email, password } = req.body;
    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
    }
    const user = await User.findOne({ email: email })
    if (user) {
        throw new Error('User already exists');
    }
    else {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: true,
            message: newUser ? 'User registered successfully. Please go Login!!' : 'Something went wrong'
        })
    }
})
// @desc    Login user
// refreshToken -> cap moi accesstoken
// accessToken -> xac thuc nguoi dung, phan quyen
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
    }
    //plan
    const user = await User.findOne({
        email: email
    })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }
    else {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        else {
            //Tach password va role ra khoi user
            const { password, role, ...userData } = user.toObject();
            //Tao accessToken va refreshToken
            const accessToken = generateAccessToken(user._id, role);
            const refreshToken = generateRefreshToken(user._id);
            //Luu refreshToken vao database
            await User.findByIdAndUpdate(user._id, { refreshToken}, { new: true });
            //Luu refreshToken vao cookie
            res.cookie('refreshToken', refreshToken, { httpOnly: true , maxAge: 7*24*60*60*1000});
            return res.status(200).json({
                success: true,
                userData,
                accessToken
                
            });
        }
    }
})
// @desc    Get current user theo accessToken
const getCurrentUser = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const user = await User.findById(_id).select('-password -refreshToken -role'); 
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }
    else {
        return res.status(200).json({
            success: true,
            user,
        });
    }
})
// @desc    Refresh token
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: 'No refreshToken'
        })
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refreshToken'
            })
        }
        const accessToken = generateAccessToken(user._id, user.role);
        return res.status(200).json({
            success: true,
            accessToken
        })
    })
})
//Neu refreshToken het han, user se phai dang nhap lai
const logoutUser = asyncHandler(async (req, res) => { 
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: 'No refresh token'
        })
    }
    //Xoa refreshToken trong database
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: '' }, {new: true});
    //Xoa refreshToken trong cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        success: true,
        message: 'Logout successfully'
    })

})
//ForgortPassword
//Khi forgot password , user nhan email kem resetToken de thay doi password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error("Missing email");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangeToken();
  
    await user.save();
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
    const data = {
      email,
      html,
    };
    const rs = await sendMail(data);
    return res.status(200).json({
      success: true,
      mes: rs.response?.includes("OK")
        ? "Hãy check mail của bạn."
        : "Đã có lỗi, hãy thử lại sau.",
    });
});
//ResetPassword
//Khi user nhan duoc email kem resetToken, user se thay doi password moi 
const resetPassword = asyncHandler(async (req, res) => {
   // const { resetToken } = req.params;
    const { password,resetToken } = req.body;
    if (!resetToken || !password) throw new Error("Invalid token or password");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token hết hạn hoặc không hợp lệ");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    return res.status(200).json({
      success: true,
      mes: "Thay đổi mật khẩu thành công",
    });
});

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshToken,
    logoutUser,
    forgotPassword,
    resetPassword
}