import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true, // Always send cookies
});

export default API;