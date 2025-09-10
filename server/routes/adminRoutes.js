import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  getDashboard, 
  getAllBlogsAdminUser, 
  deleteBlogById, 
  deleteCommentById, 

  togglePublish 
} from "../controllers/blogControllers.js";
import { getAllUsers } from "../controllers/adminControllers.js";
import user from "../models/user.js";
import { deleteUser } from "../controllers/adminControllers.js";

const router = express.Router();

// 📊 Dashboard overview
router.get("/dashboard", protect, getDashboard);

// 📝 Blog management
router.get("/allblogs", protect, getAllBlogsAdminUser);  // admin: all blogs, publisher: own blogs
router.post("/toggle-publish", protect, togglePublish);  // toggle publish/unpublish
router.delete("/blogs/:id", protect, deleteBlogById)// delete blog


// routes/adminRoutes.js

// Only admin can get all users
router.get("/allusers", protect, getAllUsers);
  

router.delete("/users/:id", protect, deleteUser);


// 💬 Comment management
router.delete("/delete-comment", protect, deleteCommentById);


export default router;
