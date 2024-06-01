const express = require('express');
const router = express.Router();
const verifyToken = require('./middlewares/authMiddleware');

const userController = require('./controllers/userController');
const postController = require('./controllers/postController')


        //**** USER ROUTES ****//
//READ Login and register forms 
router.get('/', verifyToken, userController.home);

// Submit login CREATE token
router.post('/login', userController.login);
// Submit new user CREATE user
router.post('/register', userController.register);

// Update Push new post to user.posts array
router.post('/user/posts', verifyToken, userController.push_user_post);

// DELETE user



        //**** PROTECTED ROUTES ****//
// READ user data & posts
router.get('/user/:id', verifyToken, userController.user);


// CREATE new blog post
router.post('/posts', verifyToken, postController.create_post);

// READ post by id
router.get('/posts/:id', verifyToken, postController.view_post);
// READ all posts
router.get('/posts', verifyToken, postController.all_posts);

// UPDATE post
router.put('/posts/:id', verifyToken, postController.update_post);
// UPDATE post add comment
router.post('/posts/:id/comments', verifyToken, postController.add_comment);

// DELETE post by id
router.delete('/delete/:id', verifyToken, postController.delete_post);



// //GET posts by author
// router.get('/posts/author', verifyToken, postController.user_posts);


// // Fetch user posts by id
// router.post('/posts/batch', verifyToken, postController.posts_by_id);


module.exports = router