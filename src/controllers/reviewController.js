const booksModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const mongoose = require("mongoose")
const bookModel = require("../models/bookModel")
const { updateBook } = require("./bookController")

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

        let { reviewedBy, rating, review } = details

        if (details.hasOwnProperty("reviewedBy")) {
            if (!isValid(reviewedBy)) { return res.status(400).send({ status: false, message: "reviewedBy is required and it must be string" }) }
            let name = /^[a-zA-Z ]{2,20}$/.test(reviewedBy.trim())
            if (!name) return res.status(400).send({ status: false, message: "enter valid name" })
        }

        details.reviewedAt = Date.now();


        if (rating === undefined) return res.status(400).send({ status: false, message: "rating is required" })
        let bookrating = /^[1-5]$/.test(rating)
        if (!bookrating) return res.status(400).send({ status: false, message: "enter valid rating" })


        if (details.hasOwnProperty("review")) {
            if (!isValid(review)) { return res.status(400).send({ status: false, message: "enter review" }) }

            let bookreview = /\w*\s*|\w|\D/.test(review.trim())
            if (!bookreview) return res.status(400).send({ status: false, message: "enter valid review" })
        }

        details.bookId = bookId
        await reviewModel.create(details)

        let saveData = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: +1 } }, { new: true })
        let allrev = await reviewModel.find({ bookId: bookId, isDeleted: false })
        bookDetails = { _id: saveData._id, title: saveData.title, excerpt: saveData.excerpt, userId: saveData.userId, category: saveData.category, subcategory: saveData.subcategory, isDeleted: saveData.isDeleted, reviews: saveData.reviews, reviewsData: allrev }

        res.status(201).send({ status: true, message: "Success", data: bookDetails })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}
const updateReview = async (req, res) => {

    try {
        const reviewID = req.params.reviewId
        const bookId = req.params.bookId
        let dataToUpdate = req.body
        let updateQuery = {}

        if (Object.keys(dataToUpdate) < 1) { return res.status(400).send({ status: false, message: "please input data to update" }) }

        var isValidId = mongoose.Types.ObjectId.isValid(reviewID)
        if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid reviewId id" })

        var isValidId = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid bookId id" })

        let isBook = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!isBook) {
            return res.status(404).send({ status: false, message: "Book Not Found, PLease check book Id" })
        }

        let isReview = await reviewModel.findOne({ _id: reviewID, isDeleted: false })
        if (!isReview) {
            return res.status(404).send({ status: false, message: "Review Not Found, Please Check Review Id" })
        }

        if (isReview['bookId'] != bookId) {
            return res.status(400).send({ status: false, message: "This review dosent belong To given Book Id" })
        }
        let { reviewedBy, rating, review } = dataToUpdate
        let reviewKeys = ["reviewedBy", "rating", "review"]
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            let keyPresent = reviewKeys.includes(Object.keys(req.body)[i])
            if (!keyPresent)
                return res.status(400).send({ status: false, message: "Wrong Key present" })
        }
        if (Object.keys(dataToUpdate).includes("reviewedBy")) {
            if (typeof reviewedBy != 'string') {
                return res.status(400).send({ status: false, message: "Please Give a proper Name" })
            }
            if ((reviewedBy.trim() == "") || (reviewedBy == null)) {
                reviewedBy = 'Guest'
            }
            updateQuery.reviewedBy = reviewedBy
        }

        if (Object.keys(dataToUpdate).includes("rating")) {
            if (typeof rating != 'number') {
                return res.status(400).send({ status: false, message: "invalid Rating Input" })
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, message: "Invalid Rating! , please rate in beetween 1 to 5" })
            }
            updateQuery.rating = rating
        }

        if (Object.keys(dataToUpdate).includes("review")) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: "Please Enter A Valid Review" })
            }
            updateQuery.review = review
        }

        dataToUpdate.reviewedAt = Date.now()

        await reviewModel.findOneAndUpdate({ _id: reviewID, isDeleted: false }, { $set: updateQuery }, { new: true })
        let allrev = await reviewModel.find({ bookId: bookId, isDeleted: false })
        bookDetails = { _id: isBook._id, title: isBook.title, excerpt: isBook.excerpt, userId: isBook.userId, category: isBook.category, subcategory: isBook.subcategory, isDeleted: isBook.isDeleted, reviews: isBook.reviews, reviewsData: allrev }

        return res.status(200).send({ status: true, message: "Success", Data: bookDetails })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const deleteReview = async (req, res) => {
    try {

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "NOT A VALID BOOKID" })
        }

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, message: "NOT A VALID REVIEWID" })
        }

        let book = await bookModel.findOne({ _id: bookId })

        if (!book) {
            return res.status(404).send({ status: false, message: "NO BOOK EXIST FROM THIS BOOKID " })
        }
        if (book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "THE BOOK ALREADY DELETED" })
        }
        let review = await reviewModel.findOne({ _id: reviewId })

        if (!review) {
            return res.status(404).send({ status: false, message: "NO REVIEW FOUND FROM THIS REVIEWID" })
        }
        if (review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "REVIEW OF THIS BOOK ALREADY DELETED" })
        }
        if (review.bookId != bookId) {
            return res.status(400).send({ status: false, message: `THE REVIEW WITH reviewId ID IS NOT THE REVIEW OF BOOK WITH bookId ID` })
        }


        let deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true })
        if (deletedReview) {
            let updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        }
        return res.status(200).send({ status: true, message: "REVIEW SUCCESSFULLY DELETED", })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


module.exports = { createReview, updateReview, deleteReview }
