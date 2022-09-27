const mongoose = require('mongoose')
const bookSchema= new mongoose.Schema(
    { 
        title: {type:String,reqired:true, unique:true,trim:true},
        excerpt: {type:String,reqired:true,trim:true}, 
        userId: {type:mongoose.Types.ObjectId,reqired:true, ref:"user",trim:true},
        ISBN: {type:String,reqired:true, unique:true,trim:true},
        category: {type:String,reqired:true,trim:true},
        subcategory:{ type:String,reqired:true,trim:true},
        reviews: {type:Number, default: 0}, //comment: Holds number of reviews of this book},
        deletedAt: Date, 
        isDeleted: {type:Boolean, default: false},
        releasedAt: {type:Date,reqired:true},
      },{timestamps:true}
)
 
module.exports=mongoose.model('book',bookSchema);
