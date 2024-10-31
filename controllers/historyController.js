const connectToDatabase = require('../db');

const getUserHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const db = await connectToDatabase();
        const userHistory = await db.collection('user_history').find({ user_id: userId }).toArray();
        
        if (!userHistory) {
            return res.status(404).json({ message: 'User history not found' });
        }
        return res.status(200).json(userHistory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const createUserHistory = async (req, res) => {
    const { userId, booking } = req.body;
    const newUserHistory = {
        user_id: userId,
        bookings: [booking], // Store the first booking directly
    };

    try {
        const db = await connectToDatabase();
        const result = await db.collection('user_history').insertOne(newUserHistory);
        return res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateBookingHistory = async (userId, booking) => {
    const db = await connectToDatabase();
    await db.collection('user_history').updateOne(
        { user_id: userId },
        { $push: { bookings: booking } } // Use a single bookings array
    );
};

module.exports = {
    getUserHistory,
    createUserHistory,
    updateBookingHistory,
};
