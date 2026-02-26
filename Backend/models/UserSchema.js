const mongoose = require('mongoose');

const UserTable = new mongoose.Schema({
    fullName : String,
    email : {
        type:String,
        unique:true
    },
    password : String,
    phone : Number,
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const UserModel = mongoose.model('User',UserTable);

module.exports = UserModel;