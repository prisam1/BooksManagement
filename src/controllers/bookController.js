
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel.js')
const Validator = require("../validation/validfun")
const reviewModel = require('../models/reviewModel.js')
let mongoose = require("mongoose")
let moment = require("moment")

const createBook = async function (req, res) {
    try {
        if (!Validator.checkInputsPresent(req.body)) {
            return res.status(400).send({ status: false, message: "Insert data :Bad request" })
        }

        let text = ""
        if (!req.body.title) {
                // return res.status(400).send({status:false,message:"Please provide title of the book"})
            text = "Please provide title of the book"
        } else {
            req.body.title = req.body.title.trim()
            if (!(/^[a-zA-z !&?]{2,100}$/).test(req.body.title)) {
                // return res.status(400).send({status:false,message:"Title must consist of only letters"})
                text = "Title must consist of only letters"
            } else {
                let title = await bookModel.findOne({ title: req.body.title })
                if (title) {
                // return res.status(400).send({status:false,message:"Title is already present."})
                    text = "Title is already present."
                }
            }
        }

        if (!req.body.excerpt) {
                // return res.status(400).send({status:false,message:"Please provide excerpt of the book"})
            text = (text.length == 0) ? "Please provide excerpt of the book" : text + " ; " + "Please provide excerpt of the book"
        } else {
            req.body.excerpt = req.body.excerpt.trim()
            if (!(/^[a-zA-z !&?]{2,100}$/).test(req.body.excerpt)) {
                // return res.status(400).send({status:false,message:"Excerpt must consist of only letters"})
                text = (text.length == 0) ? "Excerpt must consist of only letters" : text + " ; " + "Excerpt must consist of only letters"
            }
        }

        if (!req.body.userId) {
                // return res.status(400).send({status:false,message:"Please provide userId of the author"})
            text = (text.length == 0) ? "Please provide userId of the author" : text + " ; " + "Please provide userId of the author"
        } else {
            req.body.userId = req.body.userId.trim()
            if (!(mongoose.Types.ObjectId.isValid(req.body.userId))) {
                // return res.status(400).send({status:false,message:"Please provide valid userId of the author"})
                text = (text.length == 0) ? "Please provide valid userId of the author" : text + " ; " + "Please provide valid userId of the author"
            } else {
                let user = await userModel.findById(req.body.userId);
                if (!user) {
                    return res.status(404).send({ status: false, message: "no user found with this userId" })
                }
            }
        }

        if (!req.body.ISBN) {
                // return res.status(400).send({status:false,message:"Please provide ISBN number of the book"})
                text = (text.length == 0) ? "Please provide ISBN number of the book" : text + " ; " + "Please provide ISBN number of the book"
        } else {
            req.body.ISBN = req.body.ISBN.trim()
            if (!(/^[0-9]{3}([\-])[0-9]{10}$/).test(req.body.ISBN)) {
                // return res.status(400).send({status:false,message:"Please provide valid 13 digit valid ISBN number"})
                text = (text.length == 0) ? "Please provide valid 13 digit valid ISBN number" : text + " ; " + "Please provide valid 13 digit valid ISBN number"
            } else {
                let ISBN = await bookModel.findOne({ ISBN: req.body.ISBN });
                if (ISBN) {
                // return res.status(400).send({status:false,message:"Please provide unique ISBN number"})
                text = (text.length == 0) ? "Please provide unique ISBN number" : text + " ; " + "Please provide unique ISBN number"
                }
            }
        }

        if (!req.body.category) {
                // return res.status(400).send({status:false,message:"Please provide category of the book"})
                text = (text.length == 0) ? "Please provide category of the book" : text + " ; " + "Please provide category of the book"
        } else {
            req.body.category = req.body.category.trim()
            if (!(/^[a-zA-z ]{4,30}$/).test(req.body.category)) {
                // return res.status(400).send({status:false,message: "Category can contain only letters" })
                text = (text.length == 0) ? "Category can contain only letters" : text + " ; " + "Category can contain only letters"
            }
        }

        if (!req.body.subcategory) {
                // return res.status(400).send({status:false,message:"Please provide subcategory of the book"})
                text = (text.length == 0) ? "Please provide subcategory of the book" : text + " ; " + "Please provide subcategory of the book"
        } else {
            req.body.subcategory = req.body.subcategory.trim()
            if (!(/^[a-zA-z ]{4,30}$/).test(req.body.subcategory)) {
                // return res.status(400).send({status:false,message:`${req.body.subcategory} is not a valid subcategory`})
                text = (text.length == 0) ? `${req.body.subcategory} is not a valid subcategory` : text + " ; " + `${req.body.subcategory} is not a valid subcategory`
            }
        }

        if (!req.body.releasedAt) {
                // return res.status(400).send({status:false,message:"Please provide releasedAt"})
                text = (text.length == 0) ? "Please provide releasedAt" : text + " ; " + "Please provide releasedAt"
        } else {
            if (!(/^[12]{1}[0-9]{3}([\-])(0[1-9]|1[0-2])([\-])(0[1-9]|[12]\d|3[01])$/).test(req.body.releasedAt)) {
                // return res.status(400).send({status:false,message:"Please provide valid date in format YYYY-MM-DD"})
                text = (text.length == 0) ? "Please provide valid date in format YYYY-MM-DD" : text + " ; " + "Please provide valid date in format YYYY-MM-DD"
            } else {
                req.body.releasedAt = req.body.releasedAt.trim()
                let date = moment(req.body.releasedAt)
                if (!date.isValid()) {
                // return res.status(400).send({status:false,message:"please provide valid date on releasedAt "})
                text = (text.length == 0) ? "please provide valid date on releasedAt " : text + " ; " + "please provide valid date on releasedAt "
                } else {
                    if (date > Date.now()) {
                // return res.status(400).send({status:false,message:"please provide past date on releasedAt "})
                text = (text.length == 0) ? "please provide past date on releasedAt " : text + " ; " + "please provide past date on releasedAt "
                    }
                }
            }
        }
        if (text) {
            return res.status(400).send({ status: false, message: text })
        }
        let saveBook = await bookModel.create(req.body)
        return res.status(201).send({
            status: true,
            message: 'Success',
            data: saveBook
        })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

const getBookByQuery = async function (req, res) {
    try {
        let data = req.query;
        let { userId, category, subcategory } = data
        let bookData = { isDeleted: false }

        if (Object.keys(data).length == 0) {
            let getBooks = await bookModel.find(bookData).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
            return res.status(200).send({ status: true, message: 'Books list', data: getBooks })
        }

        if (userId) {
            let isValidId = mongoose.Types.ObjectId.isValid(userId)
            if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid user id" })
            bookData.userId = userId
        }
        if (category) {
            bookData.category = category
        }
        if (subcategory) {
            bookData.subcategory = subcategory
        }

        let books = await bookModel.find(bookData).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })

        if (books.length == 0) return res.status(404).send({ status: false, message: "No data found" })
        else return res.status(200).send({ status: true, message: 'Books list', data: books })

    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        var isValidId = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid book id" })

        let saveData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, isDeleted: 1, reviews: 1 })
        if (!saveData) { return res.status(404).send({ status: false, message: "book not found" }) }


        let data = await reviewModel.find({ bookId: bookId, isDeleted: false })
        // console.log(saveData)

        bookDetails = { _id: saveData._id, title: saveData.title, excerpt: saveData.excerpt, userId: saveData.userId, category: saveData.category, subcategory: saveData.subcategory, isDeleted: saveData.isDeleted, reviews: saveData.reviews, reviewsData: data }
        // bookDetails = {...saveData, reviewsData: data }

       return res.status(200).send({ status: true, message: "Book List", data: bookDetails })
    } catch (err) {
        return res.status(500).send({ message: 'Error', error: err.message })
    }
}

const updateBook = async function (req, res) {
    try {
        if (!Validator.checkInputsPresent(req.body)) {
            return res.status(400).send({ status: false, message: "Insert data :Bad request" })
        }

        let ID = req.params.bookId
        let text = ''
        if (!req.body.title) {
        } else {
            req.body.title = req.body.title.trim()
            if (!(/^[a-zA-z !&?]{2,50}$/).test(req.body.title)) {
                // return res.status(400).send({status:false,message:"Title must consist of only letters"})
                text = "Title must consist of only letters"
            } else {
                let title = await bookModel.findOne({ title: req.body.title })
                if (title) {
                // return res.status(400).send({status:false,message:"Title is already present, Title must be unique."})
                text = "Title is already present, Title must be unique."
                }
            }
        }

        if (!req.body.excerpt) {
        } else {
            req.body.excerpt = req.body.excerpt.trim()
            if (!(/^[a-zA-z !&?]{2,100}$/).test(req.body.excerpt)) {
                // return res.status(400).send({status:false,message:"Excerpt must consist of only letters"})
                text = (text.length == 0) ? "Excerpt must consist of only letters" : text + " ; " + "Excerpt must consist of only letters"
            }
        }

        if (!req.body.releasedAt) {
        } else {
            if (!(/^[1-2][0-9]{3}([\-])[0-9]{2}([\-])[0-9]{2}$/).test(req.body.releasedAt)) {
                // return res.status(400).send({status:false,message:"Please provide valid date in format YYYY-MM-DD"})
                text = (text.length == 0) ? "Please provide valid date in format YYYY-MM-DD" : text + " ; " + "Please provide valid date in format YYYY-MM-DD"
            } else {
                req.body.releasedAt = req.body.releasedAt.trim()
                let date = moment(req.body.releasedAt)
                // console.log(date);
                if (!date.isValid()) {
                // return res.status(400).send({status:false,message: "please provide valid date on releasedAt "})
                text = (text.length == 0) ? "please provide valid date on releasedAt " : text + " ; " + "please provide valid date on releasedAt "
                } else {
                    if (date > Date.now()) {
                // return res.status(400).send({status:false,message:"please provide past date on releasedAt " })
                text = (text.length == 0) ? "please provide past date on releasedAt " : text + " ; " + "please provide past date on releasedAt "
                    }
                    // req.body.releasedAt=date.format("DD-MM-YYYY")
                    // console.log(req.body.releasedAt)
                }
            }
        }

        if (!req.body.ISBN) {
        } else {
            req.body.ISBN = req.body.ISBN.trim()
            if (!(/^[0-9]{3}([\-])[0-9]{10}$/).test(req.body.ISBN)) {
                // return res.status(400).send({status:false,message:"Please provide valid 13 digit valid ISBN number"})
                text = (text.length == 0) ? "Please provide valid 13 digit valid ISBN number" : text + " ; " + "Please provide valid 13 digit valid ISBN number"
            } else {
                let ISBN = await bookModel.findOne({ ISBN: req.body.ISBN });
                if (ISBN) {
                // return res.status(400).send({status:false,message:"Please provide unique ISBN number"})
                text = (text.length == 0) ? "Please provide unique ISBN number" : text + " ; " + "Please provide unique ISBN number"
                }
            }
        }

        if (text) {
            return res.status(400).send({ status: false, message: text });
        }

        let updatedData = await bookModel.findOneAndUpdate({ _id: ID, isDeleted: false }, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).send({ status: false, message: "No book found" });
        }
        return res.status(200).send({ status: true, message: "Success", data: updatedData });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

// -----------> delete book
const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

        let book = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
        if (book) {
            return res.status(200).send({ status: true, message: "Book deleted successfuly" })
        }
        else {
            return res.status(400).send({ status: false, message: "Book not found" })
        }

    } catch (err) {
        res.status(500).send({ message: 'Error', error: err.message })
    }
}


module.exports = { createBook, getBookByQuery, getBookById, deleteBook, updateBook }


