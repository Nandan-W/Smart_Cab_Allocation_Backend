const express = require('express');
const { updatePassengerCount } = require('../controllers/cabController'); 
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.use(authMiddleware);

router.post('/updatePassengerCount', updatePassengerCount);

module.exports = router;
