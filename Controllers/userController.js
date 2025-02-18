require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { sendOTPEmail } = require("../utils/otpmailer");
const { sendOtpViaSMS } = require("../utils/otptwilio");

const signup = async (req, res) => {
    try {
        const { name, email, phone, password, username, address } = req.body;

        // Check if user exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already registered!" });
        }
        if (await User.findOne({ phone })) {
            return res.status(400).json({ message: "Phone number already registered!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTPs
        const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 mins

        // Create new user with OTPs
        const newUser = new User({
            name,
            email,
            phone,
            username,
            address,
            password: hashedPassword,
            emailOtp,
            emailOtpExpires: otpExpires,
            phoneOtp,
            phoneOtpExpires: otpExpires,
            isEmailVerified: false,
            isPhoneVerified: false,
        });

        await newUser.save();

        // Send OTPs
        await sendOTPEmail(email, emailOtp);
        await sendOtpViaSMS(phone, phoneOtp);

        // ✅ Return email and phone along with success message
        res.status(201).json({
            message: "User registered! Check email and SMS for OTP.",
            email,   // ✅ Send back email
            phone    // ✅ Send back phone
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// GET ALL USERS 

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords from the response

        if (!users.length) {
            return res.status(404).json({ message: "No users found!" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required!" });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        // Delete user
        await User.deleteOne({ username });

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// ✅ signin Controller
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "signin successful", token,username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // ✅ Get User Profile (Protected)
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const Controller = {
  signup,
  signin,
  deleteUser,
  getAllUsers,
}
module.exports = Controller;
