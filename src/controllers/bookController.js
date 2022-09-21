const bookModel=require('../models/bookModel')

async function getBooks(req, res){
    try {
        if (req.query.userId){
            const data = req.query
            if (data.userId && !data.userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ status: false, message: "Incorrect userId" })
            } 

            let checkUserId = await userModel.findById({ _id: userId1 })
                if (!checkUserId) { return res.status(404).send({ status: false, message: "userId is not exist" }) }

            let booksData = await bookModel.find({ userId: checkUserId, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            
            if (booksData.length == 0) {
                return res.status(404).send({ status: false, message: "No books are found" })
            } else {
                return res.status(200).send({ status: true, message: "Books list", data: booksData })
            }
        }
        else if (req.query.category) {
            let checkCategory = await bookModel.find({ category: category, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        
            if (checkCategory.length == 0) {
                return res.status(404).send({ status: false, message: "No such similar books are found by the category" })
            } else {
                return res.status(200).send({ status: true, message: "Books list", data: categoryCheck })
            };
        }    

        else if (req.query.subcategory) {

            let subcategory = req.query.subcategory

            let checkSubcategory = await bookModel.find({ subcategory: subcategory, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

            if (checkSubcategory.length == 0) {
                return res.status(404).send({ status: false, message: "No such similar books are found by the subcategory" })
            } else {
                return res.status(200).send({ status: true, message: "Books list", data: checkSubcategory })
            };
        }
        else {
           
            let newData= await bookModel.find({isDeleted:false})
            return res.status(200).send({ status:true, msg: "success", data:newData })

        }
    } catch (error) {
        return res.status(500).send({ message: "Error", error: err.message });
    }
}

module.exports.getBooks = getBooks