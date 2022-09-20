const userModel=require('../models/userModel.js')

const login = function (req, res) {
    try{
    let body = req.body;
    let data = userModel.findOne({ email: body.email, password: body.password })
    if (!data) {
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

