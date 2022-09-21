const userModel = require('../models/userModel.js')
const Validator = require("../validation/validfun")

const isValid = function (value) {
    if (typeof value === "undefined" || !value ) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}

const getBookByQuery = async function (req, res) {
    try {
        let data = req.query;
        let { userId, category, subcategory } = data
        let bookData = { isDeleted: false }

        if (Object.keys(data).length == 0) {
            getBooks = await booksModel.find({ data, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
            return res.status(200).send({ status: true, message: 'Books list', data: getBooks })
        }

        if (userId) {
            var isValidId = mongoose.Types.ObjectId.isValid(userId)
            if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid user id" })
            bookData.userId = userId
        }
        if (category) {
            bookData.category = category
        }
        if (subcategory) {
            bookData.subcategory = subcategory
        }

        let books = await booksModel.find(bookData).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })

        if (books.length == 0) return res.status(404).send({ status: false, message: "No data found" })
        else return res.status(200).send({ status: true, message: 'Books list', data: books })

    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}


const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        var isValidId = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid book id" })

        let saveData = await booksModel.findById({ _id: bookId, isDeleted: false }).select({ __v: 0, deletedAt: 0 })
        if (!saveData) { return res.status(404).send({ status: false, message: "book not found" }) }


        let data = await reviewModel.find({ bookId: bookId }).select({ isDeleted: 0, __v: 0 })

        let book = saveData
        bookDetails = { ...book, reviewsData: data }


        res.status(200).send({ ststus: true, message: "Book List", data: bookDetails })
    } catch (err) {
        res.status(500).send({ message: 'Error', error: err.message })
    }
}

module.exports = { getBookByQuery, getBookById}