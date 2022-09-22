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

//middleware.authenticate,middleware.authorization,
//middleware.authenticate,bookController.
//middleware.authenticate,bookController.

module.exports=router