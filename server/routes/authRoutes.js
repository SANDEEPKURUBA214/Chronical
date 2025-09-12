
import express from 'express';
import { register,verifyOtp, login, getAdminUsers, getUploadSignature, updateProfilePhoto, getProfile, checkAuth, logout } from '../controllers/authControllers.js';

import { protect } from "../middleware/auth.js";

import User from "../models/user.js";



const router = express.Router();




router.get("/upload-signature", getUploadSignature);
router.put("/profile-photo", protect, updateProfilePhoto);
router.get("/profile", protect, getProfile
);

router.get("/admins", getAdminUsers);
router.get("/me", protect, checkAuth);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout",logout)
export default router


