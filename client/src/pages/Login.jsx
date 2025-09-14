import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate } from "react-router-dom";
import { useNotification } from "../utils/Notification";
import API from '../utils/axios.js';
import toast from 'react-hot-toast';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { Notification, showNotification } = useNotification();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      // ✅ store only the user
      login(res.data.user);

      // Double-check with backend
      // const me = await API.get("auth/me");
      // login(me.data.user);

      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
   
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
        <a
          href="/register"
          className="rounded-full text-indigo-600 hover:underline"
        >
          Register
        </a>

        </p>
        </div>
        <Notification/>
      </div>
    </div>
  )
}

