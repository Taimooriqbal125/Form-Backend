const rateLimit = require("express-rate-limit");

const otpAttempts = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 OTP attempts per windowMs
    message: "Too many OTP verification attempts. Please try again later.",
});

module.exports = otpAttempts;
