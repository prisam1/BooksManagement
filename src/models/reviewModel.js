const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: objectId,
            required: true,
            ref: "book"
        },
        reviewedBy: {
            type: String,
            required: true,
            default: 'Guest',
           
        },
        reviewedAt: { type: Date, required: true,default:Date.now() },
        rating: {
            type: Number,
            required: true,
            min:1,
            max:5
        },
        review: { type: String },
        isDeleted: { type: Boolean, default: false }
    }
)

module.exports = mongoose.model('review', reviewSchema)