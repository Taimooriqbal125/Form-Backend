const User = require("../Models/User");

const verifyOTP = async (req, res) => {
    try {
        const { email, phone, emailOtp, phoneOtp } = req.body; // ✅ Expecting separate OTPs

        if (!email && !phone) {
            return res.status(400).json({ message: "Email or phone is required!" });
        }

        // ✅ Find user by email or phone
        const user = await User.findOne({ $or: [{ email }, { phone }] });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        const nowUTC = new Date().getTime();
        let emailVerified = false;
        let phoneVerified = false;

        // ✅ Verify email OTP if email is provided
        if (email) {
            if (user.isEmailVerified) {
                return res.status(400).json({ message: "Email already verified!" });
            }

            // ✅ Convert expiration time to UTC before comparison
            const emailOtpExpiresUTC = new Date(user.emailOtpExpires).getTime();
            

            if (user.emailOtp !== emailOtp || emailOtpExpiresUTC < nowUTC) {
                return res.status(400).json({ message: "Invalid or expired email OTP!" });
            }

            user.isEmailVerified = true;
            user.emailOtp = null;
            user.emailOtpExpires = null;
            emailVerified = true;
        }

        // ✅ Verify phone OTP if phone is provided
        if (phone) {
            if (user.isPhoneVerified) {
                return res.status(400).json({ message: "Phone already verified!" });
            }

            // ✅ Convert expiration time to UTC before comparison
            const phoneOtpExpiresUTC = new Date(user.phoneOtpExpires).getTime();

            if (user.phoneOtp !== phoneOtp || phoneOtpExpiresUTC < nowUTC) {
                return res.status(400).json({ message: "Invalid or expired phone OTP!" });
            }

            user.isPhoneVerified = true;
            user.phoneOtp = null;
            user.phoneOtpExpires = null;
            phoneVerified = true;
        }

        await user.save();

        res.status(200).json({
            message: "Verification successful!",
            emailVerified,
            phoneVerified,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = verifyOTP;
