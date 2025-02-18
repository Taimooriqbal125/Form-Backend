require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Account Verification",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📧 OTP Email Sent Successfully!");
    } catch (error) {
        console.error("❌ Error Sending OTP Email:", error.message);
    }
};

module.exports = { sendOTPEmail };
