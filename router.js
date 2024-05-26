const express = require('express');
const router = express.Router();
const verifyToken = require('./middlewares/authMiddleware');

const userController = require('./controllers/userController');


        //**** USER ROUTES ****//
//Login and register forms
router.get('/', verifyToken, userController.home);

// Submit login
router.post('/login', userController.login);
// Submit new user
router.post('/register', userController.register);


        //**** PROTECTED ROUTES ****//
// GET user page
router.get('/user/:id', verifyToken, userController.user);


// POST new blog post
// router.post('/user/:id/post', verifyToken, blogController.post);

// GET all posts
// router.get('/blog', blogController.blog)

module.exports = router