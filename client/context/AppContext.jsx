
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Set base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null); //will store { name, email, photo, role, ... }

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/blog`);
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user info if token exists
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      if (data.success) {
        setUser(data.user);
        // optional: store admin too if needed
        if (data.admin) {
          setUser((prev) => ({ ...prev, admin: data.admin }));
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user info");
    }
  };


  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    fetchBlogs();
  }, []);


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    user,      
    setUser,   
    logout
  };


  return (
    <AppContext.Provider value={{ axios, navigate, token, setToken, blogs, setBlogs, input, setInput, user, setUser }}>
      {loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  )
};

export const useAppContext = () => {
  return useContext(AppContext);
};
