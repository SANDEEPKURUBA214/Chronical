import express from "express";
import { 
  addBlog, 
  addComment,  
  generate,  
  getAllBlogs, 
  getBlogById, 
  getBlogComments 
} from "../controllers/blogControllers.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";
import { deleteBlogById } from "../controllers/blogControllers.js";

const blogRouter = express.Router();

// Public
blogRouter.get("/", getAllBlogs);               // homepage blogs (published only)
blogRouter.get("/comments/:blogId", getBlogComments); 
blogRouter.get("/blog/:id", getBlogById);

//gemini
blogRouter.post("/generate",protect, generate);


// Requires login
blogRouter.post("/comments", protect, addComment);  // add a comment (if only logged-in users allowed)
blogRouter.post("/addblog", upload.single("image"), protect, addBlog); // create blog (publisher only)

export default blogRouter;



