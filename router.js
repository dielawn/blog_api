const express = require('express');
const router = express.Router();

// require controllers
const userController = require('./controllers/userController');

//Login and register forms
router.get('/', userController.home);

// POST login
router.post('/login', userController.login);
// POST register
router.post('/register', userController.register);

        // PROTECTED ROUTES //

// GET user page
router.get('/user/:id', userController.user);
// POST new blog post
router.post('/user/:id/post', userController.post);

// GET

module.exports = router