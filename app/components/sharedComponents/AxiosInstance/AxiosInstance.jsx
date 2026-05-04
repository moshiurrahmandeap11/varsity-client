import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", 
  withCredentials: true, 
});

// https://server-bookshelf-5ws0.onrender.com/

export default axiosInstance;