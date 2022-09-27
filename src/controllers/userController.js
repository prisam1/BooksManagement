const userModel = require('../models/userModel.js')
const Validator = require("../validation/validfun")
const JWT = require("jsonwebtoken");


//---------------------------------------------------------------------------------------------------------------------------------------------------------------
const createUser1 = async function (req, res) {
    try {
        if (!Validator.checkInputsPresent(req.body)) {
            return res.status(400).send({ status: false, message: "Insert data :Bad request" })
        }
        let text = ""

        if (!req.body.title) {
            // return res.status(400).send({status:false,message:"Please provide title"})
            text = "Please provide title"
        } else {
            // req.body.title = req.body.title.trim()
            if (!Validator.isValidTitle(req.body.title, ["Mr", "Mrs", "Miss"])) {
                // return res.status(400).send({status:false,message:"Please provide a valid title form Mr, Mrs and Miss"})
                text = "Please provide a valid title form Mr, Mrs and Miss"
            }
        }

        if (!req.body.name) {
            // return res.status(400).send({status:false,message:"Please provide name"})
            text = (text.length == 0) ? "Please provide name" : text + " ; " + "Please provide name"
        } else {
            if (!(/^[a-zA-Z ]{2,20}$/).test(req.body.name)) {
                // return res.status(400).send({status:false,message:"Please provide valid name"})
                text = (text.length == 0) ? "Please provide valid name" : text + " ; " + "Please provide valid name"
            }
        }

        if (!req.body.phone) {
            // return res.status(400).send({status:false,message:"Please provide phone"})
            text = (text.length == 0) ? "Please provide phone" : text + " ; " + "Please provide phone"
        } else {
            if (!Validator.validateMobileNo(req.body.phone)) {
                // return res.status(400).send({status:false,message:"Please provide valid phone"})
                text = (text.length == 0) ? "Please provide valid phone" : text + " ; " + "Please provide valid phone"
            } else {
                let fphone = await userModel.findOne({ phone: req.body.phone })
                if (fphone) {
                    // return res.status(400).send({status:false,message:"Phone number aleardy Exist"})
                    text = (text.length == 0) ? "Phone number aleardy Exist" : text + " ; " + "Phone number aleardy Exist"
                }
            }
        }

        if (!req.body.email) {
            // return res.status(400).send({status:false,message:"Please provide email"})
            text = (text.length == 0) ? "Please provide email" : text + " ; " + "Please provide email"
        } else {
            if (!Validator.validateEmail(req.body.email)) {
                // return res.status(400).send({status:false,message:"Please provide valid email"})
                text = (text.length == 0) ? "Please provide valid email" : text + " ; " + "Please provide valid email"
            } else {
                let email = await userModel.findOne({ email: req.body.email })
                if (email) {
                    // return res.status(400).send({status:false,message:"email aleardy Exist"})
                    text = (text.length == 0) ? "email aleardy Exist" : text + " ; " + "email aleardy Exist"
                }
            }

        }

        if (!req.body.password) {
            // return res.status(400).send({status:false,message:"Please provide password"})
            text = (text.length == 0) ? "Please provide password" : text + " ; " + "Please provide password"
        } else {
            if (!Validator.validPassword(req.body.password)) {
                // return res.status(400).send({status:false,message:"Password must have one uppercase letter, one lowercase letter, one special charecter and one number and must consist of 8 to 15 charectors."})
                text = (text.length == 0) ? "Password must have one uppercase letter, one lowercase letter, one special charecter and one number and must consist of 8 to 15 charectors." : text + " ; " + "Password must have one uppercase letter, one lowercase letter, one special charecter and one number and must consist of 8 to 15 charectors."
            }
        }

        if (req.body.hasOwnProperty('address')) {
            if (typeof req.body.address !== "object" || Array.isArray(req.body.address)) {
                // return res.status(400).send({status:false,message:"address should be in object"})
                text = (text.length == 0) ? "address should be in object" : text + " ; " + "address should be in object"
            } else {
                let street = req.body.address.street
                if (!street) {
                    // return res.status(400).send({status:false,message: "Please provide street in address"})
                    text = (text.length == 0) ? "Please provide street in address" : text + " ; " + "Please provide street in address"
                } else {
                    street = street.trim()
                    if (!(/^[0-9a-zA-Z ,]{2,100}$/).test(street)) {
                        // return res.status(400).send({status:false,message:"Please provide valid street in address"})
                        text = (text.length == 0) ? "Please provide valid street in address" : text + " ; " + "Please provide valid street in address"
                    }
                }

                let city = req.body.address.city
                if (!city) {
                    // return res.status(400).send({status:false,message:"Please provide city in address"})
                    text = (text.length == 0) ? "Please provide city in address" : text + " ; " + "Please provide city in address"
                } else {
                    city = city.trim()
                    if (!(/^[a-zA-Z]{2,20}$/).test(city)) {
                        // return res.status(400).send({status:false,message:"Please provide valid city in address"})
                        text = (text.length == 0) ? "Please provide valid city in address" : text + " ; " + "Please provide city in address"
                    }
                }

                let pincode = req.body.address.pincode
                if (!pincode) {
                    // return res.status(400).send({status:false,message:"Please provide pincode in address"})
                    text = (text.length == 0) ? "Please provide pincode in address" : text + " ; " + "Please provide pincode in address"
                } else {
                    pincode = pincode.trim()
                    if (!(/^[1-9][0-9]{5}$/).test(pincode)) {
                        // return res.status(400).send({status:false,message:"Please provide valid pincode in address"})
                        text = (text.length == 0) ? "Please provide valid pincode in address" : text + " ; " + "Please provide valid pincode in address"
                    }
                }

            }
        }

        if (text) {
            return res.status(400).send({ status: false, message: text })
        }
        let saveUserData = await userModel.create(req.body)
        res.status(201).send({ status: true, message: "Success", data: saveUserData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }


}


//--------------------------------------------------------------------------------------------------------------------------
const login = async function (req, res) {
    try {

        let { email, password } = req.body
        if (!Validator.checkInputsPresent(req.body)) return res.status(400).send({ status: false, message: "Please provide email and password" })
        if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
        if (!Validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: "EmailId is invalid" })
        }

        if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
        if (!Validator.validPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is invalid" })
        }
        let loginUser = await userModel.findOne({ email: email, password: password })
        // console.log(loginUser)
        if (!loginUser) {
            return res.status(401).send({ status: false, message: "Login failed due to incorrect password or email" })
        }

        let token = JWT.sign({
            userId: loginUser._id.toString()
        }, "This is our Secret", {
            expiresIn: '1hr'
        });
        return res.status(201).send({ status: true, message: "Success", data: { token: token } })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

module.exports = { login, createUser1 }


