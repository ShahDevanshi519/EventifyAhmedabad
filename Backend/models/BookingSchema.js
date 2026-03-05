const mongoose = require('mongoose');

const BookingTable = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    numberOfTickets:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    bookingStatus:{
        type:String,
        status:["Pending","Confirmed","Cancelled"],
        default:"Confirmed"
    },
    bookingDate:{
        type:Date,
        default:Date.now
    }
});

const BookingModel = mongoose.model("Booking",BookingTable);

module.exports = BookingModel;