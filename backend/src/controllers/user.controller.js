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