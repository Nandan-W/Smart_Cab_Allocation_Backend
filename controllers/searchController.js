const connectToDatabase = require('../db');
const geolib = require('geolib');

const searchCabs = async (req, res) => {
    const { pickupLocation, dropLocation, shareCab } = req.body;

    try {
        const db = await connectToDatabase();
        const availableCabs = await db.collection('cab_locations').find().toArray();

        const sortedCabs = availableCabs.map(cab => {
            const distance = geolib.getDistance(
                { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
                { latitude: parseFloat(cab.currentLocation[1]), longitude: parseFloat(cab.currentLocation[0]) }
            )/1000;
            const travelCost = Math.max(100, cab.baseCostPerKm * distance);
            return { ...cab, distance, travelCost };
        });

        // Filter cabs based on sharing rules
        const filteredCabs = sortedCabs.filter(cab => {
            if (!shareCab) {
                return !cab.currentPassengerCount; // Only idle cabs
            } else {
                return cab.allowedSharing || !cab.currentPassengerCount; // Either sharing allowed or idle
            }
        });

        // Sort filtered cabs by distance, then by travel cost if shared
        filteredCabs.sort((a, b) => {
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            } else {
                return a.travelCost - b.travelCost; // Further sort by travel cost
            }
        });

        // Calculate discounts for shared cabs
        const results = filteredCabs.map(cab => {
            if (cab.allowedSharing && shareCab) {
                const discount = cab.travelCost * 0.1; // 10% discount
                cab.travelCost = cab.travelCost - discount;
                return { ...cab, isShared: true };
            } else {
                return { ...cab, isShared: false };
            }
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cabs', error });
    }
};

module.exports = {
    searchCabs,
};
