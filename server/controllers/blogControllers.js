import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/blogModel.js";  
import mongoose from "mongoose";
import Comment from './../models/comment.model.js';
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/blogs",
    });

    let status = "draft";
    let publishFlag = false;

    if (req.user.role === "admin") {
      if (isPublished) {
        status = "published";
        publishFlag = true;
      } else {
        status = "draft";
      }
    } else if (req.user.role === "user") {
      if (isPublished) {
        status = "pending"; 
      } else {
        status = "draft";
      }
    }

    const blog = new Blog({
      title,
      subTitle,
      description,
      category,
      image: uploadResponse.url,
      user: req.user._id,
      isPublished: publishFlag,
      status,
    });

    await blog.save();

    res.json({
      success: true,
      message:
        status === "published"
          ? "Blog published successfully"
          : status === "pending"
          ? "Blog submitted for review"
          : "Blog saved as draft",
      blog,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const getAllBlogs = async (req,res)=>{
  try{
    const blogs = await Blog.find({isPublished:true})
    res.json({success: true,blogs})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

  export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("user", "name photo role"); //  get publisher info
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("user", "name role _id photo");

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    //  Only admin or the blog owner can delete
    if (req.user.role !== "admin" && blog.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
    }

    // Delete blog
    await blog.deleteOne();

    //  Delete all comments related to this blog
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog and related comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;

    // attach logged-in user automatically
    const comment = new Comment({
      blog: blogId,
      user: req.user._id,
      content,
    });

    await comment.save();

    res.json({ success: true, message: "Comment added", comment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blog/comments/:blogId
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;  // correct param
    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name photo")  // show user name + photo
      .sort({ createdAt: -1 });        // newest first
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdminUser = async (req, res) => {
  try {
    let blogs;

    if (req.user.role === "admin") {
      // Admin → all blogs
      blogs = await Blog.find().sort({ createdAt: -1 });
    } else {
      // Any logged-in user → only their own blogs
      blogs = await Blog.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    let blogFilter = {};
    let commentFilter = {};

    if (req.user.role === "user") {
      // Publisher: only their own blogs (published & drafts)
      blogFilter = { user: req.user._id };
      commentFilter = { blogOwner: req.user._id };
    } 
     else if(req.user.role === "publisher") {
      // Publisher: only their own blogs (published & drafts)
      blogFilter = { user: req.user._id };
      commentFilter = { blogOwner: req.user._id };
    } 
    // else admin → no filter (all blogs & comments)

    // Recent blogs (role based)
    const recentBlogs = await Blog.find(blogFilter)
      .sort({ createdAt: -1 })
      .limit(5);

    // Counts (role based)
    const blogs = await Blog.countDocuments(blogFilter);
    const comments = await Comment.countDocuments(commentFilter);
    const drafts = await Blog.countDocuments({
      ...blogFilter,
      isPublished: false,
    });

    res.json({
      success: true,
      blogs,
      comments,
      drafts,
      recentBlogs,
    });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Only admin can toggle publish/unpublish
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can change publish status" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      success: true,
      message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully`,
      isPublished: blog.isPublished,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Admin can delete any comment
    if (req.user.role === "admin") {
      await comment.deleteOne();
      return res.json({ success: true, message: "Comment deleted successfully" });
    }

    //  User can delete their own comment
    if (comment.user.toString() === req.user._id.toString()) {
      await comment.deleteOne();
      return res.json({ success: true, message: "Comment deleted successfully" });
    }

    //  Publisher: can delete comments on their own blog
    const blog = await Blog.findById(comment.blog);
    if (blog && blog.user.toString() === req.user._id.toString() && req.user.role === "publisher") {
      await comment.deleteOne();
      return res.json({ success: true, message: "Comment deleted successfully" });
    }

    return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const content = await main(`Generate a detailed blog post about: ${prompt}`);
    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


