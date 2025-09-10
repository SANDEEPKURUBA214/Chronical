import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import React from "react";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);
  const { axios, user } = useAppContext(); // get logged-in user
  const navigate = useNavigate();

  const deleteBlog = (blogId) => {
    toast(
      (t) => (
        <div>
          <p className="mb-2">Delete this blog?</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5000/api/admin/blogs/${blogId}`);
                  toast.dismiss(t.id);
                  toast.success("Blog deleted!");
                  await fetchBlogs();
                } catch (err) {
                  toast.error("Failed to delete");
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/admin/toggle-publish", {
        id: blog._id,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300 hover:bg-gray-50 cursor-pointer">
      <th className="px-2 py-4">{index}</th>

      {/*  Clicking title navigates to blog detail */}
      <td
        className="px-2 py-4 text-blue-600 hover:underline"
        onClick={() => navigate(`/blog/${blog._id}`)}
      >
        {title}
      </td>

      <td className="px-2 py-4 max:sm-hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max:sm-hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>

      <td className="px-2 py-4 flex text-xs gap-3">
        {user?.role === "admin" ? (
          <>
            {/* Admin can toggle publish */}
            <button
              onClick={togglePublish}
              className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
            >
              {blog.isPublished ? "Unpublish" : "Publish"}
            </button>

            {/* Admin can delete any blog */}
            <img
              src={assets.delete_icon}
              className="w-8 hover:scale-110 transition-all cursor-pointer px-2"
              onClick={() => deleteBlog(blog._id)}
            />
          </>
        ) : user && (blog.user?._id === user._id || blog.user === user._id) ? (
          // Normal user → only delete their own blog
          <img
            src={assets.delete_icon}
            className="w-8 hover:scale-110 transition-all cursor-pointer px-2"
            onClick={() => deleteBlog(blog._id)}
          />
        ) : (
          // Other users → no actions
          <span className="text-gray-500 text-sm">No actions</span>
        )}
      </td>

      
    </tr>
  );
};

export default BlogTableItem;
