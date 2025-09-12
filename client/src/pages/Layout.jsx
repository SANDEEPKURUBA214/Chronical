import React, { useState, useEffect } from "react";
import { assets } from '../assets/assets';
import {Outlet, useNavigate} from "react-router-dom"
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/useAuthStore';
import API from '../utils/axios.js';

const Layout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    logout(); // clear store
    navigate("/login");
  };


  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
        <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12
        border-b border-gray-200'>
            <img src={assets.logo} alt='' className='w-32 sm:w-40 cursor-pointer'
            onClick={()=> navigate('/home')}/>
            <button onClick={handleLogout} className='text-sm px-8 py-2 bg-primary text-white
            rounded-full cursor-pointer'>Logout</button>
        </div>

        <div className='flex h-[calc(100vh-70px)]'>
                <Sidebar/>
                <Outlet/>
        </div>
    </>
  )

}
export default Layout