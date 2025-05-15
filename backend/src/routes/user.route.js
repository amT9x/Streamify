import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getRecommendedUsers, getMyFriends } from '../controllers/user.controller.js';

const router = express.Router();

// Áp dụng protectRoute middleware cho tất cả các route trong user.route.js
// Nếu không muốn áp dụng cho tất cả các route, có thể áp dụng riêng cho từng route
// VD: router.get('/', protectRoute, getRecommendedUsers);
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

export default router;