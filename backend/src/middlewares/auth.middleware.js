import jwt from 'jsonwebtoken';
import User from '../modules/User.js';

// Middleware để kiểm tra xem người dùng có đăng nhập hay không
export const protectRoute = async (req, res, next) => {
    // Kiểm tra xem người dùng có đăng nhập hay không
    try {
        const token = req.cookies.jwt;
        // Kiểm tra xem token có 'tồn tại' hay không
        if (!token) {
            return res.status(401).json({message: 'Unauthorized! - No token provided!'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Kiểm tra xem token có 'hợp lệ' hay không
        if (!decoded) {
            return res.status(401).json({message: 'Unauthorized! - Invalid token!'});
        }

        const user = await User.findById(decoded.id);
        // Kiểm tra xem người dùng có 'tồn tại' hay không
        if (!user) {
            return res.status(401).json({message: 'Unauthorized! - User not found!'});
        }

        req.user = user; // Lưu thông tin người dùng vào req.user để sử dụng ở middleware tiếp theo

        next(); // Cho phép tiếp tục vào middleware tiếp theo
    } catch (error) {
        console.log('Error in protectRoute middleware:', error);
        return res.status(401).json({message: 'Internal server error!'});
    }
}