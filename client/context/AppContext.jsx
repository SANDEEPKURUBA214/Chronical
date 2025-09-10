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
  const [user, setUser] = useState(null);   // logged-in user
  const [admin, setAdmin] = useState(null); // separate admin info if needed

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/blog");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user info if token exists
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.user);   // ✅ contains { role: "admin" | "user" }
        setAdmin(data.admin); // ✅ keep admin separately
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



  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    user,    // logged-in user
    admin,   // separate admin object if needed
    setUser,

    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
