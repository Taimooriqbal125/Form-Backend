const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    emailOtp: { type: String },
    emailOtpExpires: { type: Date },
    phoneOtp: { type: String },
    phoneOtpExpires: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
