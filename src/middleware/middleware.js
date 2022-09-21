const jwt = require('jsonwebtoken')
const bookModel = require("../models/bookModel")
const mongoose=require('mongoose')
let ObjectID = mongoose.Types.ObjectId




const authenticate = function (req, res, next) {
    try {

        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(400).send({ status: false, message: "no token found" })
        }
        let decodedToken = jwt.verify(token, "This is our Secret")
        if (!decodedToken) {
            return res.staus(401).send({ status: false, message: "Invalid token" })
        }
        req.decodedToken = decodedToken
        console.log(decodedToken)
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const authorization = async (req, res, next) => {
    try {

        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(400).send({ status: false, message: "no token found" })
        }
        if (req.params.bookId) {
            let bookId = req.params.bookId

            if (!ObjectID.isValid(bookId)) { return res.status(401).send({ status: false, message: "Not a valid BookID" }) }
            let book = await bookModel.findById(bookId)
            if (!book) { return res.status(404).send({ status: false, message: "No such book exists" }) }

            if (book.userId != req.decodedToken.userId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            next()
        }else if(req.body.userId){
            if (req.body.userId != req.decodedToken.userId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            next()
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorization = authorization
