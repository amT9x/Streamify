import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Người gửi
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Người nhận
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    }, // Trạng thái của lời mời kết bạn
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema); // Tạo model FriendRequest

export default FriendRequest; // Xuất model FriendRequest