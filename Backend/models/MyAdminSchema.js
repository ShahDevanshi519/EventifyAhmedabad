const mongoose = require('mongoose');

const AdminTable = mongoose.Schema({
    adminName:String,
    email:String,
    password:String
})

const AdminModel = mongoose.model('MyAdmin',AdminTable)

module.exports = AdminModel
