import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import Dashboard from './../pages/Dashboard';
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-screen bg-white shadow-md flex flex-col">

      <nav className="flex-1 flex flex-col">
        <NavLink end={true} to="/layout/dashboard" className={({isActive})=>`flex 
        items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${isActive &&
            "bg-primary/10 border-r-4 border-primary"}`}>

            <img src={assets.dashboard_icon_4} alt="" className='min-w-4 w-5'/>
            <p>Dashboard</p>
        </NavLink>

        <NavLink end={true} to="/layout/addblog" className={({isActive})=>`flex 
        items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${isActive &&
            "bg-primary/10 border-r-4 border-primary"}`}>

            <img src={assets.add_icon} alt="" className='min-w-4 w-5'/>
            <p>Add Blog</p>
        </NavLink>

        <NavLink end={true} to="/layout/listblog" className={({isActive})=>`flex 
        items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${isActive &&
            "bg-primary/10 border-r-4 border-primary"}`}>

            <img src={assets.list_icon} alt="" className='min-w-4 w-5'/>
            <p>List Blog</p>
        </NavLink>
    
        {user?.role === "admin" && (
          <NavLink
            to="/layout/allusers"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${
                isActive && "bg-primary/10 border-r-4 border-primary"
              }`
            }
          >
            <img src={assets.allusers} alt="" className="w-5" />
            <p>All Users</p>
          </NavLink>

        )}

        <NavLink end={true} to="/layout/profile" className={({isActive})=>`flex 
        items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${isActive &&
            "bg-primary/10 border-r-4 border-primary"}`}>

            <img src={assets.profile_icon} alt="" className='min-w-4 w-5'/>
            <p>Profile</p>
        </NavLink>
    
      </nav>
    </div>
  );
};

export default Sidebar;
