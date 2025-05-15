import FriendRequest from "../modules/FriendRequest.js";

// Lấy danh sách người dùng đã đăng ký
export async function getRecommendedUsers(req, res) {
    try {
        // Lấy thông tin người dùng hiện tại từ req.user
        const currentUserId = req.user.id;
        const currentUser = req.user;

        // Lọc người dùng đã onboard và không phải là bạn bè của người dùng hiện tại
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne:  currentUserId} },
                { $id: { $nin: currentUser.friends } },
                { isOnBoarded: true },
            ],
        });
        res.status(200).json({recommendedUsers: recommendedUsers}); // Trả về danh sách người dùng đã đăng ký
    } catch (error) {
        console.log("Error in getRecommendedUsers controller: ", error);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}

// Lấy danh sách bạn bè của người dùng hiện tại
export async function getMyFriends(req, res) {
    try {
        // Lấy bạn bè của người dùng hiện tại từ req.user và populate thông tin bạn bè
        const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePicture nativeLanguage learningLanguage"); // chọn fr
        res.status(200).json(user.friends); // Trả về danh sách bạn bè
    } catch (error) {
        console.log("Error in getMyFriends controller: ", error);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const {id: recipientId} = req.params; // Lấy id người nhận từ params
        
        // Chặn việc gửi yêu cầu kết bạn đến chính mình
        if(myId.toString() === recipientId) {
            return res.status(400).json({message: "You can't send friend request to yourself!"});
        }
        
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({message: "Recipient not found!"}); // Người nhận không tồn tại
        }

        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends!"}); // Đã là bạn bè
        }

        // Kiểm tra nếu req đã tồn tại
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId}, // Người gửi là tôi, người nhận là người khác
                {sender: recipientId, recipient: myId} // Người gửi là người khác, người nhận là tôi
            ]
        });

        if(existingRequest) {
            return res.status(400).json({message: "A Friend request already exists between you and this user"}); // Yêu cầu kết bạn đã tồn tại
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        }); // Tạo yêu cầu kết bạn mới

        res.status(201).json({friendRequest}); // Trả về yêu cầu kết bạn mới
    } catch (error) {
        console.log("Error in sendFriendRequest controller: ", error.message);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params; // Lấy id yêu cầu từ params
        const friendRequest = await FriendRequest.findById(requestId); // Tìm yêu cầu kết bạn theo id
        
        if(!friendRequest) {
            return res.status(404).json({message: "Friend request not found!"}); // Yêu cầu kết bạn không tồn tại
        }

        // Xác minh người dùng hiện tại là người nhận
        if(friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "You are not authorized to accept this friend request!"}); // Không có quyền chấp nhận yêu cầu này
        }

        friendRequest.status = "accepted"; // Cập nhật trạng thái yêu cầu kết bạn
        await friendRequest.save(); // Lưu yêu cầu kết bạn đã cập nhật

        // Cập nhật danh sách bạn bè của cả hai người
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }, // Thêm người nhận vào danh sách bạn bè của người gửi
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }, // Thêm người gửi vào danh sách bạn bè của người nhận
        });

        res.status(200).json({message: "Friend request accepted!"}); // Trả về thông báo chấp nhận yêu cầu kết bạn
    } catch (error) {
        console.log("Error in acceptFriendRequest controller: ", error.message);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const inComingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending",
        }).populate("sender", "fullName profilePicture nativeLanguage learningLanguage"); // Lấy danh sách yêu cầu kết bạn đến với người dùng hiện tại
        const acceptedRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "accepted",
        }).populate("sender", "fullName profilePicture"); // Lấy danh sách yêu cầu kết bạn đã chấp nhận với người dùng hiện tại

        res.status(200).json({
            inComingRequests,
            acceptedRequests,
        }); // Trả về danh sách yêu cầu kết bạn
    } catch (error) {
        console.log("Error in getFriendRequests controller: ", error.message);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}

// Lấy danh sách yêu cầu kết bạn đã gửi đi
export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate("recipient", "fullName profilePicture nativeLanguage learningLanguage"); // Lấy danh sách yêu cầu kết bạn đã gửi đi
        res.status(200).json(outgoingRequests); // Trả về danh sách yêu cầu kết bạn đã gửi đi
    } catch (error) {
        log("Error in getOutgoingFriendRequests controller: ", error.message);
        res.status(500).json({ message: 'Internal Server error!' });
    }
}