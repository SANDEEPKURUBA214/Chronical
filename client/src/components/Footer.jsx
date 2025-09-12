
 import {React,useState}from 'react'
 import { assets } from '../assets/assets'
 import { useAppContext } from "../../context/AppContext";
 import toast from "react-hot-toast";
 import UserCard from "../components/UserCard"
 import { useEffect } from 'react';
import API from "../utils/axios.js"


 const Footer = () => {

     const [users, setUsers] = useState([]);

     const fetchUsers = async () => {
         try {
         const { data } = await API.get(`/auth/admins`);
         if (data.success) {
             setUsers(data.users);
         } else {
             toast.error(data.message);
         }
         } catch (error) {
         toast.error(error.message);
         }
     };

         useEffect(() => {
             fetchUsers();
         }, []);
         
return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>
        <div className='flex flex-col md:flex-row items-start justify-between 
         gap-10 py-10 border-b border-gray-500/30 text-gray-500'>
            <div>
                <h1 className='text-3xl font-bold text-black'
                ><span className='text-primary'>Ad</span>min</h1>
                <div className="flex items-baseline">
                 {users
                     .filter((u)=> u.role==="admin")
                     .map((user) => (
                     <UserCard key={user._id} user={user} fetchUsers={fetchUsers} />
                 ))}
            </div>
            </div>
        </div>
        <p className='py-4 text-center text-sm md:text-base 
        text-gray-500/80'>Copyright 2025 © Chronical - All Right Reserved </p>
     </div>
   )
 }

 export default Footer

