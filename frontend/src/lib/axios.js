import axios from "axios";

export const axiosInstance = axios.create({
    baseURl: "http://localhost:5001/api",
    withCredentials: true, // send cookies with requests
});