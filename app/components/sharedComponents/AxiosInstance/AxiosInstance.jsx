import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", 
  withCredentials: true, 
});



export default axiosInstance;