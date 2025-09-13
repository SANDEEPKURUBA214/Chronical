import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import UserCard from "../components/UserCard";
import API from '../utils/axios.js';

const AllUsers = () => {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
    const { data } = await API.get( `/admin/allusers`);
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
    <div className="flex-grid">
        {users
        .filter((u)=> u.role!=="admin")
        .map((user) => (
          <UserCard key={user._id} user={user} fetchUsers={fetchUsers} />
        ))}
    </div>


  )
};

export default AllUsers;
