const mongoose = require('mongoose');

const AdminTable = mongoose.Schema({
    adminName:String,
    lastName:String,
    email:String,
    password:String,
    mobile:String,
    address:String,
    city:String,
    zip:Number,
    profileImage:{
        type:String,
        default:""
    },
    resetToken:String,
    resetTokenExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const AdminModel = mongoose.model('MyAdmin',AdminTable)

module.exports = AdminModel
