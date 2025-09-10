
import User from "../models/user.js";
import PendingVerification from "../models/PendingVerification.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from '../utils/sendEmails.js';
import Otp from "../models/otpModel.js"
import generateToken from "../utils/generateToken.js"

console.log("generateToken:", generateToken);


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    // save OTP in DB (overwrite if exists for same email)
    await Otp.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true }
    );
    // temporarily save user data in req (alternative: store in a staging table)
    req.app.locals.tempUser = {
      [email]: { name, email, password: hashedPassword, role },
    };
    // send OTP email
    await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // check OTP in DB
    const record = await Otp.findOne({ email });
    if (!record) {
      return res.status(400).json({ message: "No OTP found or expired. Please register again." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP matches → create user
    const tempUser = req.app.locals.tempUser?.[email];
    if (!tempUser) {
      return res.status(400).json({ message: "User data missing. Please register again." });
    }

    const { name, password, role } = tempUser;
    const user = await User.create({ name, email, password, role, isVerified: true });


    await Otp.deleteOne({ email });
    delete req.app.locals.tempUser[email];

    res.status(201).json({ message: "Account verified successfully! Please login.", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before login" });
    }
    //  Debug logs
    if (await user.matchPassword(password)) {
      const token = generateToken(user._id, user.role);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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




