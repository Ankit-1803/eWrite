const mongoose=require("mongoose");

// Make User Schema
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleAuth;
        },
        select: false,
    },
    // One user have multiple blogs
    blogs :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        }
    ],
    isVerify: {
        type: Boolean,
        default: false,
        select: false,
    },
    googleAuth: {
        type: Boolean,
        default: false,
        select: false,
    },
    profilePic: {
        type: String,
        default: null
    },
    profilePicId: {
        type: String,
        default: null
    },
    bio: {
        type: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    saveBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        }
    ],
    likeBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        }
    ],
    showLikedBlogs: {
        type: Boolean,
        default: true
    },
    showSavedBlogs: {
        type: Boolean,
        default: false
    },
},{timestamps: true})

// Make User model (Entry in DB)
const User=mongoose.model("User",userSchema);


module.exports=User