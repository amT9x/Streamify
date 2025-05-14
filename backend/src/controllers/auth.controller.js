import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    // Lấy thông tin từ client
    const {email, password, fullName} = req.body;

    // Kiểm tra thông tin
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: 'Please fill all the fields!'});
        }

        if (password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters!'});
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message: 'Email is not valid!'});
        }

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: 'Email already exists, please use another one!'});
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const ramdomAvartar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = new User({
            fullName,
            email,
            password,
            profilePicture: ramdomAvartar,
        });

    } catch (error){

    }
}

export function login(req, res) {
    res.send('Login Route!');
}

export function logout(req, res) {
    res.send('Logout Route!');
}