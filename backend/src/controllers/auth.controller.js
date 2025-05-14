import User from '../modules/User.js';
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
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: ramdomAvartar,
        });

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        // Với cookie này, trình duyệt sẽ tự động gửi JWT trong các request tiếp theo đến server, nhưng không thể bị đánh cắp bởi JavaScript hoặc bên thứ ba.
        res.cookie('jwt', token, {
            httpOnly: true, // chặn tấn công XSS, chặn truy cập cookie từ JS từ phía client
            secure: process.env.NODE_ENV === 'production', // chỉ cho phép cookie được gửi qua HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian hết hạn của cookie (7 ngày)
            sameSite: 'strict', // Chỉ gửi cookie khi request đến từ cùng domain -> chống tấn công CSRF
        });

        res.status(201).json({success:true, user: newUser});

    } catch (error){
        console.error("Error in SignUp controller: ", error);
        res.status(500).json({message: 'Internal Server error!'});
    }
}

export async function login(req, res) {
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({message: 'Please fill all the fields!'});
        }

        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message: 'Email or password is incorrect!'});
        }
        

        const isMatch = await user.matchPassword(password);
        if (!isMatch){
            return res.status(400).json({message: 'Email or password is incorrect!'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
        });

        res.status(200).json({success:true, user});
    } catch (error){
        console.error("Error in Login controller: ", error);
        res.status(500).json({message: 'Internal Server error!'});
    }
}

export function logout(req, res) {
    res.clearCookie('jwt');
    res.status(200).json({success: true,message: 'Logout successfully!'});
}