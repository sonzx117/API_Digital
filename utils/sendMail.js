const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const sendMail = asyncHandler(async ({email,html}) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Đảm bảo sử dụng TLS
          }
    });

  
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"shopdigital" <no-relply@shopdigital.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot Password", // Subject line
        html: html, // html body
    });
    return info;

})
module.exports = sendMail;