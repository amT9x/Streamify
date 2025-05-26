import {axiosInstance} from './axios.js';

export const signup = async (signupData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/signup', signupData);
    return res.data;
}