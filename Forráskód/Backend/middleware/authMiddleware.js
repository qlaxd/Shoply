const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
/**
 * Middleware to authenticate requests using JWT.
 * Extracts the token from the 'Authorization' header, verifies it,
 * and attaches the decoded user information to the request object.
 * If the token is missing or invalid, it responds with an appropriate error message.
 */
const authMiddleware = async (req, res, next) => { // Make the function async
  const token = req.header('Authorization')?.split(' ')[1]; // Bejövő token eltávolítása a 'Bearer' prefixről
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from DB using the ID from the token payload
    const user = await User.findById(decoded.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found.' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Access denied: User account is not active.' });
    }

    // Attach the user object (without password) to the request
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

