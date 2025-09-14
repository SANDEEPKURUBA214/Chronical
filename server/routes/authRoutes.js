
import express from 'express';
import { register,verifyOtp, login, getAdminUsers, getUploadSignature, updateProfilePhoto, getProfile, checkAuth, logout } from '../controllers/authControllers.js';
import upload from './../middleware/multer.js';
import { protect } from "../middleware/auth.js";
<<<<<<< HEAD
=======
import upload from './../middleware/multer.js';
>>>>>>> 77036a4d908633e512d0f478704b27ea7907bbdf
import User from "../models/user.js";




const router = express.Router();




<<<<<<< HEAD
router.get("/upload-signature",protect,getUploadSignature);
=======
router.get("/upload-signature", getUploadSignature);
>>>>>>> 77036a4d908633e512d0f478704b27ea7907bbdf
router.put("/profile-photo", protect, upload.single("file"), updateProfilePhoto);
router.get("/profile", protect, getProfile
 );

router.get("/admins", getAdminUsers);
router.get("/me", protect, checkAuth);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout",logout)


export default router
