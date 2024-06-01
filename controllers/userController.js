const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../schemas/postSchema');
require('dotenv').config();


exports.remove_post = async (req, res) => {
    try {

        const postId = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: 'Post not found' });
        }
        await Post.findByIdAndDelete(postId)       
        
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // mongoDB, IDs are stored as ObjectId, compare as strings
        user.posts = user.posts.filter(id => id.toString() !== postId.toString());

        await user.save();

        res.status(200).json({ message: `Removed post id: ${postId}` });
    } catch (error) {
        res.status(500).json({ message: `Error cleaning up null posts: ${error.message}` });
    }
};




exports.home = (req, res) => {
    if (req.user) {
        return res.status(200).json({ message: 'Valid token', user: req.user });
    } else {
        return res.status(200).json({ message: 'Welcome, please login or register' });
    }
}


// LOGIN AUTH
exports.login = async (req, res) => {
   const { username, password } = req.body;
   try {
    // find user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' })
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' })
    }
    // generate token
    const token = jwt.sign(
        { id: user._id, username: user.username, admin: user.admin, posts: user.posts, }, 
        process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });    
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }

};

// REGISTER NEW USER
exports.register = async (req, res) => {
    const { username, password, admin } = req.body;
    try {
        // check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const newUser = new User({ username, password: hashedPassword, admin: admin, posts: [] });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}`})
    }
}

exports.user = async (req, res) => {
    if (req.user) {
        res.status(200).json({ message: 'Welcome, you are already logged in', user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthorized access, please login' });
    }
};

exports.push_user_post = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const postId = req.body.postId;
        console.log(`UserId: ${userId}, PostId: ${postId}`)

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        user.posts.push(postId);

        await user.save();
        res.status(200).json({ message: 'Post added to user successfully'});

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}`})
    }  
    
}