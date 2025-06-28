const jwt = require('jsonwebtoken');

exports.protect = function(req, res, next) {
  // Log all incoming headers for debugging
  console.log('Incoming Headers:', req.headers);

  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Extracted Token:', token);

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token Decoded Successfully');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 