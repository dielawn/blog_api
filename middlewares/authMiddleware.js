const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decoded; // Attach the decoded user information to the request object
        }
        next(); // Proceed to the next middleware or route handler
    });
}