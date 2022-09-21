const jwt = require('jsonwebtoken')
const bookModel = require("../models/BookModel")



const authenticate = function (req, res, next) {
try{
    
    let token = req.headers["x-auth-token"||"X-Auth-Token"]
    if (!token) {
       return res.status(400).send({ status:false,message: "no token found" })
    }
    let decodedToken = jwt.verify(token, "This is our Secret")
    if(!decodedToken){
       return res.staus(401).send({status:false,message:"Invalid token"})
    }
    req.decodedToken=decodedToken
    next();
}catch(err){
    res.status(500).send({status:false,message:err.message})
}
}


const authorization=async (req, res, next)=>{
    try{
        
          let token = req.headers["x-auth-token"||"X-Auth-Token"]
            if (!token) {
             return   res.status(400).send({ status:false,message: "no token found" })
            }
            let ObjectID = mongoose.Types.ObjectId
            if (req.params.bookId) {
                let bookId = req.params.bookId
    
                if (!ObjectID.isValid(bookId)) { return res.status(401).send({ status: false, message: "Not a valid BookID" }) }
                let book = await bookModel.findById(bookId)
                if (!book) { return res.status(404).send({ status: false, message: "No such book exists" }) }
    
                if (book.userId != req.decodedToken.userId) {
                    return res.status(403).send({ status: false, message: "You are not a authorized user" })
                }
                return next()
            }
        }
     catch(err){
            res.status(500).send({ status: false, message: err.message })
        }
    }
    
    module.exports.authenticate = authenticate
module.exports.authorization = authorization
