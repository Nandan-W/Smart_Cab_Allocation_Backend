const connectToDatabase = require('../db');
const {ObjectId} = require('mongodb');

const updatePassengerCount = async (req, res) => {
    console.log("inside update passenger count");
    const { cabId , newPassengerCount } = req.body;

    try {
        const db = await connectToDatabase();
        const cab = await db.collection('cab_locations').findOne({ _id: new ObjectId(cabId) });


        if (!cab) {
            return res.status(404).json({ message: 'Cab not found' });
        }

        await db.collection('cab_locations').updateOne(
            { _id: new ObjectId(cabId) },
            { $set: { currentPassengerCount: newPassengerCount } }
        );

        res.status(200).json({ message: 'Passenger count updated', newPassengerCount });
    } catch (error) {
        res.status(500).json({ message: 'Error updating passenger count', error });
    }
};

module.exports = {
    updatePassengerCount,
};
