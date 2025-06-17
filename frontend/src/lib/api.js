import {axiosInstance} from './axios.js';

export const signup = async (signupData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/signup', signupData);
    return res.data;
}

export const login = async (loginData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/login', loginData);
    return res.data;
}

export const logout = async () => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/logout');
    return res.data;
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get('http://localhost:5001/api/auth/me');
        return res.data;
    } catch (error) {
        console.log("Error fetching auth user:", error);
        return null;
    }
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post('http://localhost:5001/api/auth/onboarding', userData);
    return res.data;
}

export async function getRecommendedUsers() {
    const res = await axiosInstance.get('http://localhost:5001/api/users');
    return res.data;
}

export async function getMyFriends() {
    const res = await axiosInstance.get('http://localhost:5001/api/users/friends');
    return res.data;
}

export async function getOutgoingFriendRequests() {
    const res = await axiosInstance.get('http://localhost:5001/api/users/outgoing-friend-requests');
    return res.data;
}

export async function sendFriendRequest(userId) {
    const res = await axiosInstance.post(`http://localhost:5001/api/users/friend-request/${userId}`);
    return res.data;
}