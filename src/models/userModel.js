const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        title: { type: string, required: true, enum: [Mr, Mrs, Miss] },
        name: { type: string, required: true },
        phone: { type: string, required: true, unique: true },
        email: { type: string, required: true, unique: true },
        password: { string, required: true },
        address: {
            street: { string },
            city: { string },
            pincode: { string }
        }
    }, { timestamps: true }
)

module.exports=mongoose.model('user',userSchema);