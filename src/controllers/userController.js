const userModel=require('../models/userModel.js')
const Validator = require("../validation/validfun")

const login = async function (req, res) {
    try{
    
    let { email, password }=req.body
    if (!Validator.checkInputsPresent(req.body)) return res.status(400).send({ status: false, message: "Data must be present" })
    if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
    if(!Validator.validateEmail(email)){
        return res.status(400).send({ status: false, message: "EmailId is invalid" })
    }
    
    if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
    if(!Validator.validPassword(password)){
        return res.status(400).send({ status: false, message: "Password is invalid" })
    }
    let loginUser = userModel.findOne({ email: email, password:password })
    if (!loginUser) {
        return res.status(401).send({ status: false, message: "Login failed due to incorrect password or email" })
    }
   let token = jwt.sign({
        userId: loginUser["_id"].toString()
    }, "This is our Secret", {
        expiresIn: '20s' // expires in 20 seconds
    });
    return res.status(200).send({status:true,message:"Success",data: {token:token}})
}
catch(err){
    return res.status(401).send({ status: false, message: err.message })

}
}


const createUser=async function(req,res){
    try{
        let body=req.body;
        if(checkInputsPresent(body)){

        }
        


    }
    catch(err){


    }

}


