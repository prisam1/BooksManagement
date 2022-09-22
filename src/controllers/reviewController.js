const booksModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const mongoose = require("mongoose")
//const { isValid } = require("../controller/userController");

const isValid = function (value) {
    if (typeof value === "undefined" || !value) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}
const createReview = async function (req, res) {
   try {
        const details = req.body
        const bookId = req.params.bookId

        if (Object.keys(details).length < 1) { return res.status(400).send({ message: "Insert data :Bad request" }) }

        if (!bookId) return res.status(400).send({ status: false, message: "bookId is required" })

        var isValidId = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid book id" })
        let bookDetails = await booksModel.findOne({ _id: bookId, isDeleted: false });
        if (!bookDetails) { res.status(404).send({ status: false, message: "The book doesn't exist" }) }

        let { reviewedBy, reviewedAt, rating, review } = details
        
        if(details.hasOwnProperty("reviewedBy"))
        {
        if (!isValid(reviewedBy)) { return res.status(400).send({ status: false, message: "reviewedBy is required and it must be string" }) }
        let name = /^[a-zA-Z]{2,20}$/.test(reviewedBy.trim())
        if (!name) return res.status(400).send({ status: false, message: "enter valid name" })
        }
                
        if (reviewedAt === undefined || reviewedAt.trim().length === 0) return res.status(400).send({ status: false, message: "date is required" })
        bookreviewedAt = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(reviewedAt.trim())
        if (!bookreviewedAt) return res.status(400).send({ status: false, message: "enter valid date " })

       
        if (rating === undefined) return res.status(400).send({ status: false, message: "rating is required" })
        let bookrating = /^[1-5]\d*(\.\d+)?$/.test(rating)
        if (!bookrating) return res.status(400).send({ status: false, message: "enter valid rating" })

        
        if(details.hasOwnProperty("review")){
        if (!isValid(review)) { return res.status(400).send({ status: false, message: "enter review" }) }

        let bookreview = /\w*\s*|\w|\D/.test(review.trim())
        if (!bookreview) return res.status(400).send({ status: false, message: "enter valid review" })
        }

        details.bookId= bookId
        const data = await reviewModel.create(details)
        bookDetails.review = bookDetails.review + 1
      
        await booksModel.findOneAndUpdate({ _id: bookId }, { review: bookDetails.review }, { new: true })
        
        let book=bookDetails
        bookDetails = { ...book, reviewData: data}

        res.status(201).send({ status: true,message :"books list", data: bookDetails })
    }
    catch (err) {
         res.status(500).send({ status: false, message: err.message });
    }
}
