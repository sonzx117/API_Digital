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
            const { password, role,refreshToken, ...userData } = user.toObject();
            //Tao accessToken va refreshToken
            const accessToken = generateAccessToken(user._id, role);
            const newrefreshToken = generateRefreshToken(user._id);
            //Luu refreshToken vao database
            await User.findByIdAndUpdate(user._id, { refreshToken: newrefreshToken}, { new: true });
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
//get all users
const getUsers = asyncHandler(async (req, res) => {
    //tach password va role refreshToken ra khoi response
    const response = await User.find().select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        users : response
    })
})
//delete user theo id 
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        });
    }
    const user = await User.findByIdAndDelete(_id);
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'User deleted successfully' : 'User not found'
    })
})
//Update info User by user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id || !req.body) throw new Error("Missing input");
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken');;
    return res.status(200).json({
      success: user ? true : false,
      user,
    });
})
//Update info User by admin
const updateUserbyAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if ( Object.keys(req.body).length === 0) throw new Error("Missing input");
    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken');;
    return res.status(200).json({
      success: user ? true : false,
      updateUser: user? user : 'Something went wrong'
    });
})
//Update Address
const updateAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error("Missing input");
    const response = await User.findByIdAndUpdate(_id, { $push: {address: req.body.address} }, { new: true }).select('-password -role -refreshToken');
    return res.status(response ? 200 : 400).json({
        success: response ? true : false,
        updateAddress: response ? response : 'Something went wrong'
    })
    
})
//upadte Cart
// const updateCart = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { pid, quantity, color } = req.body;
//     if (!pid || !quantity || !color) throw new Error("Missing input");
//     const user = await User.findById(_id).select('cart');
//     const alreadyProduct = user?.cart?.find(el =>
//         el.product.toString() === pid)
//     if (alreadyProduct)
//     {
//         if (alreadyProduct.color === color) {
//             const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } },
//                 { $set: { 'cart.$.quantity': quantity } }, { new: true })
//             return res.status(response ? 200 : 400).json({
//                 success: response ? true : false,
//                 updateCart: response ? response : 'Something went wrong'
//             })
//         }
//         else {
//             const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -role -refreshToken');
//             return res.status(response ? 200 : 400).json({
//                 success: response ? true : false,
//                 updateCart: response ? response : 'Something went wrong'
//             })
//         }
//     }else {
//         const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -role -refreshToken');
//         return res.status(response ? 200 : 400).json({
//             success: response ? true : false,
//             updateCart: response ? response : 'Something went wrong'
//         })
//     }
//  })
// const updateCart = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { pid, quantity, color } = req.body;
//     if (!pid || !quantity || !color) throw new Error("Missing inputs");
//     const user = await User.findById(_id).select("cart");
  
//     const alreadyProduct = user?.cart?.find(
//       (el) => el.product.toString() === pid
//     );
//     console.log(alreadyProduct);
  
//     if (alreadyProduct) {
//       if (alreadyProduct.color === color) {
//         const response = await User.updateOne(
//           { cart: { $elemMatch: alreadyProduct } },
//           { $set: { "cart.$.quantity": quantity } },
//           { new: true }
//         );
//         return res.status(200).json({
//           success: response ? true : false,
//           updatedCart: response ? response : "Something went wrong",
//         });
//       } else {
//         const response = await User.findByIdAndUpdate(
//           _id,
//           { $push: { cart: { product: pid, quantity, color } } },
//           { new: true }
//         );
  
//         return res.status(200).json({
//           success: response ? true : false,
//           updatedCart: response ? response : "Something went wrong",
//         });
//       }
//     } else {
//       const response = await User.findByIdAndUpdate(
//         _id,
//         { $push: { cart: { product: pid, quantity, color } } },
//         { new: true }
//       );
  
//       return res.status(200).json({
//         success: response ? true : false,
//         updatedCart: response ? response : "Something went wrong",
//       });
//     }
// })
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, color } = req.body;

    // Validate inputs
    if (!pid || !quantity || !color) {
        return res.status(400).json({
            success: false,
            message: "Missing inputs",
        });
    }

    // Find the user and the cart
    const user = await User.findById(_id).select("cart");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    // Find if the product already exists in the cart
    const alreadyProduct = user?.cart?.find(
        (el) => el.product.toString() === pid && el.color === color
    );

    // If the product exists and the color matches, update the quantity
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } },
            { $set: { 'cart.$.quantity': quantity } }, { new: true })
        return res.status(response ? 200 : 400).json({
            success: response ? true : false,
            updateCart: response ? response : 'Something went wrong'
        })
    } else {
        // If product doesn't exist in cart or color doesn't match, add new item to the cart
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -role -refreshToken');
        return res.status(response ? 200 : 400).json({
            success: response ? true : false,
            updateCart: response ? response : 'Something went wrong'
        })
    }
});

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser, 
    updateUser,
    updateUserbyAdmin,
    updateAddress,
    updateCart
}