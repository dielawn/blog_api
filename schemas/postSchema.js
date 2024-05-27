const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

const Post = mongoose.model('Post', postSchema, 'post');

module.exports = Post;