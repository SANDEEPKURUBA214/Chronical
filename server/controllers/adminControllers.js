import user from "../models/user.js"; // lowercase import since your file/model is user.js
import Blog from "../models/blogModel.js";

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const users = await user.find().select("-password"); // use lowercase model
    res.json({ success: true, users });
  } catch (error) {
    console.error(" getAllUsers error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { id } = req.params;

    // Delete all blogs by this user
    await Blog.deleteMany({ user: id });

    // Delete the user
    await user.findByIdAndDelete(id);

    res.json({ success: true, message: "User and blogs deleted" });
  } catch (error) {
    console.error(" deleteUser error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
