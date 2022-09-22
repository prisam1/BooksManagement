const express=require('express');
const router=express.Router()
const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")
const middleware=require('../middleware/middleware')



router.post('/register',userController.createUser1)
router.post('/login',userController.login)
router.post('/books',middleware.authenticate,middleware.authorization,bookController.createBook)
router.get('/books',middleware.authenticate,bookController.getBookByQuery)
router.get('/books/:bookId',middleware.authenticate,bookController.getBookById)
router.put('/books/:bookId',middleware.authenticate,middleware.authorization,bookController.updateBook)
router.delete('/books/:bookId',middleware.authorization,bookController.deleteBook)


module.exports=router