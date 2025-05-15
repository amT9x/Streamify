import FriendRequest from "../modules/FriendRequest";

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