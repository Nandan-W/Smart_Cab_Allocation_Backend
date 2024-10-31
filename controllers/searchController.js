const connectToDatabase = require('../db');
const geolib = require('geolib');

const searchCabs = async (req, res) => {
    console.log("inside searchCabs");
    const { pickupLocation, dropLocation } = req.body;

    console.log('Searching cabs with:', pickupLocation, dropLocation);

    try {
        const db = await connectToDatabase();
        const availableCabs = await db.collection('cab_locations').find().toArray();

        // Calculating distances and sorting
        const sortedCabs = availableCabs.map(cab => {
            const distance = geolib.getDistance(
                { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
                { latitude: parseFloat(cab.currentLocation[1]), longitude: parseFloat(cab.currentLocation[0]) }
            );
            return { ...cab, distance };
        }).sort((a, b) => a.distance - b.distance);
        console.log("answer computed ")
        res.status(200).json(sortedCabs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cabs', error });
    }
};

module.exports = {
    searchCabs,
};
