const mongoose = require('mongoose');

const ContactTable = new mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    message:String,
    status:{
        type:String,
        default:"pending"
    }
})

const ContactModel = mongoose.model('Contact',ContactTable)

module.exports = ContactModel