const express = require('express');
const router = express.Router();

// require controllers
const userController = require('./controllers/userController');

//Login and register forms
router.get('/', userController.login);

// POST login
router.post('/login', userController.login);
// POST register
router.post('/register', userController.create_user);

        // PROTECTED ROUTES //

// GET user page
router.get('/user/:id', userController.view_user);
// POST new blog post
router.post('/user/:id/post', userController.create_post);

// GET

