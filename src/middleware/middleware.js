const jwt = require('jsonwebtoken')
const bookModel = require("../models/bookModel")
const mongoose = require('mongoose')
let ObjectID = mongoose.Types.ObjectId




const authenticate = function (req, res, next) {
    try {

        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(400).send({ status: false, message: "no token found" })
        }
        jwt.verify(token, "This is our Secret", function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, message: err.message })
            }
            req.decodedToken = decodedToken
            // console.log(decodedToken)
            next();
        })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const authorization = async (req, res, next) => {
    try {

        let token = req.headers["x-api-key" || "X-Api-Key"]
        // console.log(req.method, req.route.path)
        if (!token) {
            return res.status(400).send({ status: false, message: "no token found" })
        }
        if ((req.method == "PUT" || req.method == "DELETE") && (req.route.path == "/books/:bookId")) {
            if (req.params.bookId) {
                let bookId = req.params.bookId

                if (!ObjectID.isValid(bookId)) { return res.status(401).send({ status: false, message: "Not a valid BookID" }) }
                let book = await bookModel.findOne({_id:bookId,isDeleted:false})
                if (!book) { return res.status(404).send({ status: false, message: "No such book exists" }) }

                if (book.userId != req.decodedToken.userId) {
                    return res.status(403).send({ status: false, message: "You are not a authorized user" })
                }
                next()
            }else{
                return res.status(400).send({ status: false, message: "Please provide bookId" })
            }
        }

        if (req.route.path == "/books" && req.method == 'POST') {
            if (!Object.keys(req.body).length == 0) {
                if (req.body.userId) {
                    if (req.body.userId != req.decodedToken.userId) {
                        return res.status(403).send({ status: false, message: "You are not a authorized user" })
                    }
                    next()
                }else{
                    return res.status(403).send({ status: false, message: "Please provide userId for Authorization" })
                }
            } else {
                return res.status(400).send({ status: false, message: "Insert data :Bad request" })
            }
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorization = authorization
