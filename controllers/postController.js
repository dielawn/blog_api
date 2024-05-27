const User = require('../schemas/userSchema');
const Post = require('../schemas/postSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.create_post = async (req, res) => {
    const {title, content} = req.body;
    const author = req.user._id;
    const newPost = new Post({ title, author, content });
    try {
        await newPost.save();
        res.status(201).json({ message: 'Posted successfully' })
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.edit_post = async (req, res) => {
    try {
        const {title, content} = req.body; 
        const author = req.user._id;
        const updatedPost = { title, content, author }
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            { $set: updatedPost }, 
            { new: true, runValidators: true }
        );
        post ?
            res.status(200).json({ message: 'Post update successful' })
        :
            res.status(404).json({ message: 'Post not found' })

        return;

    }catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.add_comment = async (req, res) => {
    try {
        const parentPost = await Post.findById(req.params.id)
        const comment = new Post({ title, author, content })
        await comment.save()
        parentPost.comments.push(comment)
        
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            { $set: parentPost }, 
            { new: true, runValidators: true }
        );
        post ?
            res.status(201).json({ message: 'Comment added'})
        :
            res.status(404).json({ message: 'Post commented on not found'})
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.view_post = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        post ?
            res.status(200).json({ message: `Title: ${post.title}`, post }) 
        :
            res.status(404).json({ message: 'Post not found' })
        return

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.all_posts = async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 })

        allPosts ?
            res.status(200).json({ message: 'Success retrieving all posts', posts: allPosts })
        :
            res.status(404).json({ message: 'No posts found' })
        return;

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.remove_post = async (req, res) => {
    try {
        const postId = req.params.id;
        await Post.findByIdAndDelete(postId)
        res.status(200).json({ message: `Post ${postId} deleted` })
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};



