

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import AddBlog from "./pages/AddBlog";
import ListBlog from "./pages/ListBlog";

import { Toaster } from "react-hot-toast";
import "quill/dist/quill.snow.css";
import Profile from './components/Profile';

import AllUsers from './pages/Allusers';





export default function App() {
  const { user } = useAuthStore();

  return (
    <div>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/layout" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="addBlog" element={<AddBlog />} />
              <Route path="listBlog" element={<ListBlog />} />
              <Route path="allusers" element={<AllUsers />} />
              <Route path="profile" element={<Profile/>}/>
            </Route>
          </>
        ) : (
          // If no user → redirect everything else to login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}
