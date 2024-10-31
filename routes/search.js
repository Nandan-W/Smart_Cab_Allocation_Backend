const express = require('express');
const { searchCabs } = require('../controllers/searchController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.use(authMiddleware); 
// console.log("search route");
router.post('/searchCabs', searchCabs);

module.exports = router;
