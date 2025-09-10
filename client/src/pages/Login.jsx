import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate } from "react-router-dom";
import { useNotification } from "../utils/Notification";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { Notification, showNotification } = useNotification();
  const { setToken, setUser } = useAppContext();


  const handleSubmit = async (e) => {
       e.preventDefault();   // prevent form reload
       try {
         setLoading(true);
         const res = await axios.post(
           "http://localhost:5000/api/auth/login",
           { email, password },
           { withCredentials: true }
         );
         login(res.data);
         if (res.data.token) {
             localStorage.setItem("token", res.data.token);
         }

         showNotification("Login successful!", "success");
         navigate("/home");
       } catch (err) {
         showNotification(err.response?.data?.message || "Login failed", "error");
       }
       setLoading(false);
     };


  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30
      shadow-xl show-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
              <h1 className='text-3xl font-bold'
              ><span className='text-primary'>Please</span>Login</h1>
              <p className='font-light'>Enter your credentials </p>
          </div>

          <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md
          text-gray-600'>
              <div className='flex flex-col'>
                  <label> Email </label>
                  <input onChange={e=> setEmail(e.target.value)} value={email}
                  type='email' required placeholder='Email ID' className='
                  border-b-2 border-gray-300 p-2 outline-none mb-6'/>
              </div>
              <div className='flex flex-col'>
                  <label> Password </label>
                  <input onChange={e=> setPassword(e.target.value)} value={password}
                  type='password' required placeholder='Password' className='
                  border-b-2 border-gray-300 p-2 outline-none mb-6'/>
              </div>
              <button type='submit' className='w-full py-2 font-medium bg-primary
              text-white rounded-full cursor-pointer hover:bg-primary/90'
              > Login</button>
          </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="rounded-full text-indigo-600 hover:underline">
            Register
          </a>
        </p>
        </div>
        <Notification/>
      </div>
    </div>
  )
}

