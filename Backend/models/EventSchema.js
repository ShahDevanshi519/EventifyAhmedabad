const mongoose = require('mongoose');

const EventTable = new mongoose.Schema({
    title:String,
    category:String,
    eventImage:String,
    date:Date,
    time:String,
    venue:String,
    area:String,
    price:Number,
    totalseats:Number,
    seats:Number,
    description:String,
    rating:Number,
    reviews:Number,
    isTrending:Boolean,
    isLive:Boolean,
    isLoved:Boolean,
    whatToExpect:[String],
    note:String,
})

const EventModel = mongoose.model('Event',EventTable);

module.exports = EventModel;