const mongoose = require('mongoose');

const UserTable = new mongoose.Schema({
    fullName : String,
    lastName : String,
    email : {
        type:String,
        unique:true
    },
    password : String,
    phone : Number,
    address: String,
    city : String,
    zip : Number,
    profileImage : {
        type : String,
        default : ""
    },
    resetToken:String,
    resetTokenExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const UserModel = mongoose.model('User',UserTable);

module.exports = UserModel;