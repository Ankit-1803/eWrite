const mongoose = require("mongoose");

// Make Like Schema
const likeSchema=new mongoose.Schema({
    blog : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

// Make likeSchema model (Entry in DB)
const Like = mongoose.model("Like",likeSchema)

module.exports=Like