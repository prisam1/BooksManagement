const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: objectId,
            required: true,
            ref: "book",
            trim:true
        },
        reviewedBy: {
            type: String,
            required: true,
            default: 'Guest',
            trim:true
           
        },
        reviewedAt: { type: Date, required: true,default:Date.now(),trim:true },
        rating: {
            type: Number,
            required: true,
            min:1,
            max:5
        },
        review: { type: String,trim:true },
        isDeleted: { type: Boolean, default: false }
    }
)

module.exports = mongoose.model('review', reviewSchema)