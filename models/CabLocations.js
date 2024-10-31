const connectToDatabase = require('../db');

const CabLocationModel = {
    async create(driverName, coordinates, vehicleType, vehicleNumber) {
        const db = await connectToDatabase();
        const result = await db.collection('cab_locations').insertOne({
            driverName,
            currentLocation: {
                type: 'Point',
                coordinates,
            },
            vehicleType,
            vehicleNumber,
        });
        return result;
    }
};

module.exports = CabLocationModel;
