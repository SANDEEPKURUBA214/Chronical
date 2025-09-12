import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // reads from .env
  withCredentials: true,                  // needed if your server sends cookies
});

export default API;
