import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });

// So sánh mật khẩu
userSchema.pre("save", async function (next) {
    // Nếu mật khẩu không thay đổi thì không cần mã hóa lại
    if(!this.isModified("password")) {
        return next(); // Không cần làm gì nếu không thay đổi
    }

    // Nếu có thay đổi thì tiến hành mã hóa
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enterPassword) {
    const isPasswordMatch = await bcrypt.compare(enterPassword, this.password);
    return isPasswordMatch;
};

const User = mongoose.model("User", userSchema);

export default User;