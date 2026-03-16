const mongoose = require('mongoose');

const FeedbackTable = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    feedback:String,
    feedbackDate:{
        type:Date,
        default:Date.now
    }
});

const FeedbackModel = mongoose.model("Feedback",FeedbackTable);

module.exports = FeedbackModel;