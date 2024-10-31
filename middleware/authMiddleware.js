const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) {
    console.log("no jwt token!")
    return res.status(401).json({ message: 'Access denied. No token provided.' });

  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("jwt token incorrect or expired!");
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports.authMiddleware = authMiddleware;
