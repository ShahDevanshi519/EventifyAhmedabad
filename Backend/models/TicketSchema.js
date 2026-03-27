const mongoose = require('mongoose');

const TicektTypeTable = new mongoose.Schema({
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    type:{
        type:String,
        enum:["General","VIP"]
    },
    price:Number,
    availableSeats:Number
})

const TicektModel = mongoose.model("TicketType",TicektTypeTable)

module.exports = TicektModel