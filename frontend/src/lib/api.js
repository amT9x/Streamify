import {axiosInstance} from './axios.js';

export const signup = async (signupData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/signup', signupData);
    return res.data;
}

export const getAuthUser = async () => {
    const res = await axiosInstance.get('http://localhost:5001/api/auth/me');
    return res.data;
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/onboarding', userData);
    return res.data;
}