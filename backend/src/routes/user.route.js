import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();

// Áp dụng protectRoute middleware cho tất cả các route trong user.route.js
// Nếu không muốn áp dụng cho tất cả các route, có thể áp dụng riêng cho từng route
// VD: router.get('/', protectRoute, getRecommendedUsers);
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

export default router;