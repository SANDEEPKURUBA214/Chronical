
import express from 'express';
import { registerUser,verifyOtp, loginUser, getAdminUsers } from '../controllers/authControllers.js';

import { protect } from "../middleware/auth.js";
import imagekit from '../configs/imageKit.js';
import User from "../models/user.js";

const router = express.Router();



router.get("/me", protect, async (req, res) => {
  try {
    let admin = null;

    // If user is not admin → fetch admin
    if (req.user.role !== "admin") {
      admin = await User.findOne({ role: "admin" }).select("name email photo");
    }

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        photo: req.user.photo,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
      admin, //  include admin
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.get("/upload-signature", (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json({
      success: true,
      ...authParams,   // signature, token, expire
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put("/profile-photo", protect, async (req, res) => {
  try {
    req.user.photo = req.body.photo;
    await req.user.save();
    res.json({ success: true, message: "Profile photo updated!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});


router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user, // from protect middleware
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/admins", getAdminUsers);

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

export default router


