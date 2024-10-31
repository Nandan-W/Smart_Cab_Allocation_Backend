

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware').authMiddleware;
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);


router.use(authMiddleware);
router.get('/protected', (req, res) => {
  res.json({ message: 'Hello, authenticated user!' });
});

module.exports = router;