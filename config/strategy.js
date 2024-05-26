const LocalStrategy = require('passport-local').Strategy;

const User = require('../schemas/userSchema'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginStrategy = new LocalStrategy(
    
    async function(username, password, done) {
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
                { id: user._id, username: user.username }, 
                process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.json({ message: 'Login successful', token });    
        } catch (error) {
            res.status(500).json({ message: `Server error: ${error}` })
        }
    }
);

module.exports = loginStrategy;