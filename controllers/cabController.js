// backend/controllers/cabController.js
const Cab = require('../models/Cab');

const findNearestCab = async (location) => {
    const cabs = await Cab.find();
    // Basic distance calculation (assuming flat coordinates for simplicity)
    const nearestCab = cabs.reduce((prev, curr) => {
        const prevDistance = Math.sqrt(Math.pow(prev.location.x - location.x, 2) + Math.pow(prev.location.y - location.y, 2));
        const currDistance = Math.sqrt(Math.pow(curr.location.x - location.x, 2) + Math.pow(curr.location.y - location.y, 2));
        return currDistance < prevDistance ? curr : prev;
    });
    return nearestCab;
};

module.exports = { findNearestCab };
