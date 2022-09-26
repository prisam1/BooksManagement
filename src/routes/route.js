const express=require('express');
const router=express.Router()
const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")
const middleware=require('../middleware/middleware')
const reviewController=require('../controllers/reviewController.js')



router.post('/register',userController.createUser1)
router.post('/login',userController.login)
router.post('/books',middleware.authenticate,middleware.authorization,bookController.createBook)
router.get('/books',middleware.authenticate,bookController.getBookByQuery)
router.get('/books/:bookId',middleware.authenticate,bookController.getBookById)
router.put('/books/:bookId',middleware.authenticate,middleware.authorization,bookController.updateBook)
router.delete('g',middleware.authenticate,middleware.authorization,bookController.deleteBook)

router.post('/books/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)





router.all('/*', function (req, res) {
    res.status(400).send({status:"false",message:"Route not fond"});
});



module.exports=router