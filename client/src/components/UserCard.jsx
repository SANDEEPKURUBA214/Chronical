import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from './../assets/assets';
import API from "../utils/axios.js";

const UserCard = ({ user, fetchUsers }) => {


  //  Delete user (and blogs)
  const handleDelete = async () => {
    toast(
      (t) => (
        <div>
          <p className="mb-2">
            Delete <b>{user.name}</b> and all their blogs?
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={async () => {
                try {
                  await API.delete(`/admin/users/${user._id}`);
                  toast.dismiss(t.id);
                  toast.success("User & blogs deleted!");
                  fetchUsers();
                } catch (err) {
                  toast.error("Failed to delete user");
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

  // Format joined date
  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-md border hover:shadow-lg transition w-full h-auto">
      <div className="flex items-center gap-3">
        <img
          src={user.photo || assets.profile_icon}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500 px-4">{user.email}</p>
          <p className="text-xs text-gray-400">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {user.role !== "admin" && (
        <button
          onClick={handleDelete}
          className="px-2 py-2 text-xs hover:bg-red-600 hover:text-white rounded-md transition"
          >
          <img src={assets.delete_icon}/>
        </button>
      )}
    </div>

  );
};

export default UserCard;
