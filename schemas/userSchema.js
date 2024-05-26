const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    admin: { type: Boolean, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})


const User = mongoose.model('User', userSchema, 'user');

module.exports = User;