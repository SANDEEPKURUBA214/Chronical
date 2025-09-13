
import User from "../models/user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from '../utils/sendEmails.js';
import Otp from "../models/otpModel.js"
import jwt from "jsonwebtoken";

import imagekit from "../configs/imageKit.js";




// Generate OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// REGISTER: store data in OTP collection
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    await Otp.deleteMany({ email }); // cleanup old OTP

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ name, email, password, code, expiresAt });

    await sendEmail(
      email,
      "Verify your Email for Chronical",
      `Your OTP code is: ${code}. It expires in 10 minutes.`
    );

    res.status(201).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP: create user
export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    const otpRecord = await Otp.findOne({ email, code });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password, // hashed in schema
      isVerified: true,
    });

    await Otp.deleteMany({ email });

    res.json({
      message: "Account verified successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Login
// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Render
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allow cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Clear old cookie
    res.clearCookie("token", cookieOptions);

    // Set new cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};


// Utility to pick safe user fields
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  photo: user.photo,
  isVerified: user.isVerified,
});

// -------------------- Check Auth --------------------
export const checkAuth = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.status(200).json(formatUser(req.user));
};

// -------------------- Get ImageKit Upload Signature --------------------
export const getUploadSignature = (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const authParams = imagekit.getAuthenticationParameters();
    res.json({ success: true, ...authParams });
  } catch (err) {
    console.error("getUploadSignature error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- Update Profile Photo --------------------
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/profiles",
    });

    req.user.photo = uploadResponse.url;
    await req.user.save();

    res.json({ success: true, message: "Profile photo updated!", photo: uploadResponse.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.json({ success: true, user: formatUser(req.user) });
};


export const getAdminUsers = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({ success: true, users: admins });
  } catch (error) {
    console.error(" getAdminUsers error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
