const mongoose = require('mongoose')
const bookSchema= new mongoose.Schema(
    { 
        title: {type:String,reqired:true, unique:true},
        excerpt: {type:String,reqired:true}, 
        userId: {type:mongoose.Types.ObjectId,reqired:true, ref:"user"},
        ISBN: {type:String,reqired:true, unique:true},
        category: {type:String,reqired:true},
        subcategory:{ type:[String],reqired:true},
        reviews: {type:Number, default: 0}, //comment: Holds number of reviews of this book},
        deletedAt: Date, 
        isDeleted: {type:Boolean, default: false},
        releasedAt: {type:Date,reqired:true},
      },{timestamps:true}
)
 
module.exports=mongoose.model('book',bookSchema);
