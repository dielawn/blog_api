const express = require('express');
const router = express.Router();
const verifyToken = require('./middlewares/authMiddleware');

const userController = require('./controllers/userController');
const postController = require('./controllers/postController')


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
router.post('/posts', verifyToken, postController.create_post);

//GET post by id
router.get('/posts/:id', verifyToken, postController.view_post)

// GET all posts
router.get('/posts', verifyToken, postController.all_posts);

//GET posts by author
router.get('/posts/author', verifyToken, postController.user_posts);

// POST new comment to existing post
router.post('/posts/:id/comments', verifyToken, postController.add_comment);

// Fetch user posts by id
router.post('/posts/batch', verifyToken, postController.posts_by_id);

// Update Push new post to user.posts array
router.post('/user/posts', verifyToken, userController.push_user_post);

module.exports = router