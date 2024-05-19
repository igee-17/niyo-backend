const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    const payload = {
        userId: user.id, // Replace with the actual user ID from the database
    };

    const options = {
        expiresIn: '30m', // Set expiry time for the token (e.g., 30 minutes)
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}


exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded.userId);

        req.userId = decoded.userId; // Attach decoded user ID to the request object
        next();
    } catch (error) {
        res.status(403).send({ message: 'Invalid token' });
    }
};