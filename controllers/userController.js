const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.home = (req, res) => {
    res.json({ message: 'Welcome please login or register ' })
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
        { id: user._id, username: user.username }, 
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
    const [ username, password, admin ] = req.body;
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
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}`})
    }
}