import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "https://varsity-server.onrender.com/api", 
  withCredentials: true, 
});



export default axiosInstance;