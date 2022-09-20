const userModel=require('../models/userModel.js')
const Validator = require("../validation/validfun")


const userModel = require('../model/userModel')
const JWT = require("jsonwebtoken");

const isValid = function (value) {
    if (typeof value === "undefined" || !value ) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}

const createUser = async function (req, res) {
    try {
        let data = req.body
        const { title, name, phone, email, password, address } = data

        if (Object.keys(data).length < 1) { return res.status(400).send({ status:false, message: "Insert data :Bad request" }) }

       
        if (!isValid(title)) { return res.status(400).send({ status: false, message: "title is required" }) }
        let title1 = /^(Mr|Mrs|Miss){0,3}$/.test(title.trim())
        if (!title1) return res.status(400).send({ status: false, message: "enter valid title Mr, Mrs or Miss" })

        
        if (!isValid(name)) { return res.status(400).send({ status: false, message: "name is required" }) }
        let fname = /^[a-zA-Z]{2,20}$/.test(name.trim())
        if (!fname) return res.status(400).send({ status: false, message: "enter valid first name" })

       
        if (!isValid(phone)) { return res.status(400).send({ status: false, message: "mobile number is required"})}
        let mobile = /^((\+91)?|91)?[6789][0-9]{9}$/.test(phone.trim())
        if (!mobile) return res.status(400).send({ status: false, message: "enter valid phone number" })
        let fphone = await userModel.find({ phone: phone })
        if (fphone)
        {return res.status(400).send({ status: false, message: "Mobile number is aleardy Exist" })
        }
        
        if (!isValid(email)) { return res.status(400).send({ status: false, message: "email is required" }) }
        let mail1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
        if (!mail1) return res.status(400).send({ status: false, message: "enter valid mail" })
        let femail = await userModel.find({ email: email })

        if (femail) return res.status(400).send({ status: false, message: "Email is aleardy Exist" })

       
        if (!isValid(password)) { return res.status(400).send({ status: false, message: "password is required" }) }
        let pass = /^[a-zA-Z0-9]{8,15}$/.test(password.trim())
        if (!pass) return res.status(400).send({ status: false, message: "enter valid password" })
         
       
        if (data.hasOwnProperty("address")) {
            if(typeof address!==Object){return res.status(400).send({status:false, message:"address should be in object"})}
         
            let street = address.street
            if (!isValid(street)) { return res.status(400).send({ status: false, message: "street is required" }) }

            let street1 = /\w*\s*|\w/.test(street.trim())
            if (!street1) return res.status(400).send({ status: false, message: "enter valid street" })

            
            let city = address.city
            if (!isValid(city)) { return res.status(400).send({ status: false, message: "city is required and it must be string" }) }

            let city1 = /^[a-zA-Z]{2,20}$/.test(name.trim())
            if (!city1) return res.status(400).send({ status: false, message: "enter valid city name" })

            let pincode = address.pincode
            if (!isValid(pincode)) { return res.status(400).send({ status: false, message: "pincode is required" }) }

            let pin = /^[1-9][0-9]{5}$/.test(pincode.trim())
            if (!pin) return res.status(400).send({ status: false, message: "enter valid pincode" })


        }

        let saveUserData = await userModel.create(data)
        res.status(201).send({ status: true,message:"Success", data: saveUserData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const login = async function (req, res) {
    try{
    
    let { email, password }=req.body
    if (!Validator.checkInputsPresent(req.body)) return res.status(400).send({ status: false, message: "Data must be present" })
    if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
    
    if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
    let loginUser = userModel.findOne({ email: email, password:password })
    if (!loginUser) {
        return res.status(401).send({ status: false, message: "Login failed due to incorrect password or email" })
    }
   let token = jwt.sign({
        userId: data["_id"].toString()
    }, "This is our Secret", {
        expiresIn: '20s' // expires in 20 seconds
    });
    return res.status(200).send({status:true,message:"Success",data: {token:token}})
}
catch(err){
    return res.status(401).send({ status: false, message: err.message })

}
}

