import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import API from './../src/utils/axios.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await API.get("/blog/");
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBlogs();
  }, []);

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return <AppContext.Provider value={{ user, blogs, setUser, fetchBlogs, logout, loading }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
