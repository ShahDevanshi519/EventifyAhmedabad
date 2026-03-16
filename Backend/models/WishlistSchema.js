const mongoose = require('mongoose');

const WishlistTable = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"   
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    wishlistDate:{
        type:Date,
        default:Date.now
    }
})

const WishlistModel = mongoose.model("Wishlist",WishlistTable);

module.exports = WishlistModel;