const userModel = require('../models/userModel.js')
const bookModel = require('../models/bookModel.js')
const Validator = require("../validation/validfun")
let mongoose = require("mongoose")
let moment = require("moment")

const createBook = async function (req, res) {
    try {
        if (!Validator.checkInputsPresent(req.body)) {
            return res.status(400).send({ status: false, message: "Insert data :Bad request" })
        }

        text = ""
        if (!req.body.title) {
            text = "Please provide title of the book"
        } else {
            req.body.title = req.body.title.trim()
            if (!(/^[a-zA-z ]{2,50}$/).test(req.body.title)) {
                text = "Title must consist of only letters"
            } else {
                let title = await bookModel.findOne({ title: req.body.title })
                if (title) {
                    text = "Title is already present."
                }
            }
        }

        if (!req.body.excerpt) {
            text = (text.length == 0) ? "Please provide excerpt of the book" : text + " ; " + "Please provide excerpt of the book"
        } else {
            req.body.excerpt = req.body.excerpt.trim()
            if (!(/^[a-zA-z ]{2,100}$/).test(req.body.excerpt)) {
                text = (text.length == 0) ? "Excerpt must consist of only letters" : text + " ; " + "Excerpt must consist of only letters"
            }
        }

        if (!req.body.userId) {
            text = (text.length == 0) ? "Please provide userId of the author" : text + " ; " + "Please provide userId of the author"
        } else {
            req.body.userId = req.body.userId.trim()
            if (!(mongoose.Types.ObjectId.isValid(req.body.userId))) {
                text = (text.length == 0) ? "Please provide valid userId of the author" : text + " ; " + "Please provide valid userId of the author"
            } else {
                let user = await userModel.findById(req.body.userId);
                if (!user) {
                    text = (text.length == 0) ? "NO author found with this userId" : text + " ; " + "NO author found with this userId"
                }
            }
        }

        if (!req.body.ISBN) {
            text = (text.length == 0) ? "Please provide ISBN number of the book" : text + " ; " + "Please provide ISBN number of the book"
        } else {
            req.body.ISBN = req.body.ISBN.trim()
            if (!(/^[0-9]{3}([\-])[0-9]{10}$/).test(req.body.ISBN)) {
                text = (text.length == 0) ? "Please provide valid 13 digit valid ISBN number" : text + " ; " + "Please provide valid 13 digit valid ISBN number"
            } else {
                let ISBN = await bookModel.findOne({ ISBN: req.body.ISBN });
                if (ISBN) {
                    text = (text.length == 0) ? "Please provide unique ISBN number" : text + " ; " + "Please provide unique ISBN number"
                }
            }
        }

        if (!req.body.category) {
            text = (text.length == 0) ? "Please provide category of the book" : text + " ; " + "Please provide category of the book"
        } else {
            req.body.category = req.body.category.trim()
            if (!(/^[a-zA-z]{4,30}$/).test(req.body.category)) {
                text = (text.length == 0) ? "Category can contain only letters" : text + " ; " + "Category can contain only letters"
            }
        }

        if (!req.body.subcategory) {
            text = (text.length == 0) ? "Please provide subcategory of the book" : text + " ; " + "Please provide subcategory of the book"
        } else {
            if ((Array.isArray(req.body.subcategory) || typeof req.body.subcategory == "string")) {
                if(Array.isArray(req.body.subcategory)){
                    for(let ele of req.body.subcategory){
                        if (!(/^[a-zA-z]{4,30}$/).test(ele)) {
                            text = (text.length == 0) ? `${ele} is not a valid subcategory` : text + " ; " + `${ele} is not a valid subcategory`
                        }
                    }
                }else{
                    if (!(/^[a-zA-z]{4,30}$/).test(req.body.subcategory)) {
                        text = (text.length == 0) ? `${req.body.subcategory} is not a valid subcategory` : text + " ; " + `${req.body.subcategory} is not a valid subcategory`
                    }
                }
            } else {
                text = (text.length == 0) ? "SubCategory must be an String or Array" : text + " ; " + "SubCategory can be an String or Array"
            }

        }

        if (!req.body.releasedAt) {
            text = (text.length == 0) ? "Please provide releasedAt" : text + " ; " + "Please provide releasedAt"
        } else {
            if (!(/^[0-9]{4}([\-])[0-9]{2}([\-])[0-9]{2}$/).test(req.body.releasedAt)) {
                text = (text.length == 0) ? "Please provide date in format YYYY-MM-DD" : text + " ; " + "Please provide date in format YYYY-MM-DD"
            } else {
                req.body.releasedAt=req.body.releasedAt.trim()
                let date = moment(req.body.releasedAt, "YYYY-MM-DD")
                if (!date.isValid()) {
                    text = (text.length == 0) ? "please provide valid date on releasedAt " : text + " ; " + "please provide valid date on releasedAt "
                }else{
                    if(date>Date.now()){
                    text = (text.length == 0) ? "please provide past date on releasedAt " : text + " ; " + "please provide past date on releasedAt "
                    }
                }
            }
        }

        if (text) {
            return res.status(400).send({ status: false, message: text })
        }
        let saveBook=await bookModel.create(req.body)
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





module.exports = { createBook }
