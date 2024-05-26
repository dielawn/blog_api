const express = require('express');
const router = express.Router();
const verifyToken = require('./middlewares/authMiddleware')

// require controllers
const userController = require('./controllers/userController');

//Login and register forms
router.get('/', verifyToken, userController.home);

// POST login
router.post('/login', userController.login);
// POST register
router.post('/register', userController.register);

        // PROTECTED ROUTES //

// GET user page
router.get('/user/:id', verifyToken, userController.user);
// POST new blog post
router.post('/user/:id/post', verifyToken, userController.post);

// GET all posts
router.get('/blog', )
module.exports = router