const express = require('express');
const { getUserHistory, createUserHistory } = require('../controllers/historyController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();


// Create user history
router.post('/', createUserHistory);


// Fetch user history
router.get('/:userId', authMiddleware, getUserHistory);

module.exports = router;
