require("dotenv").config();
const twilio = require("twilio");


const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtpViaSMS = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is ${otp}. It is valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log("📱 OTP sent via SMS:", message.sid);
    } catch (error) {
        console.error("❌ Error sending OTP via SMS:", error.message);
    }
};

module.exports = { sendOtpViaSMS };
