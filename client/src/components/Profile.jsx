import {React, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import API from "../utils/axios.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile");
      if (data.success) setProfile(data.user);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.put("/auth/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProfile((prev) => ({ ...prev, photo: data.photo }));
      toast.success("Profile photo updated!");
    };



  if (!profile) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading profile...</p>
    );
  }

  return (
    //<div className="w-full flex justify-center bg-blue-50/50 min-h-screen">
    <div className="w-full flex px-80 py-20 items-start bg-blue-50/50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Upload Button */}
          <label className="mt-2 bg-primary text-white text-xs px-3 py-1 rounded cursor-pointer">
            {uploading ? "Uploading..." : "Edit Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Name:</span>
            <span>{profile.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Email:</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Joined:</span>
            <span>{new Date(profile.createdAt).toDateString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Role:</span>
            {profile.role === "admin" ? (
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                Admin
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                User/Publisher
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
