const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT.
 * Extracts the token from the 'Authorization' header, verifies it,
 * and attaches the decoded user information to the request object.
 * If the token is missing or invalid, it responds with an appropriate error message.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

