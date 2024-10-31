const connectToDatabase = require('../db');

const UserModel = {
    async create(email, password) {
        const db = await connectToDatabase();
        const result = await db.collection('Users').insertOne({ email, password });
        return result;
    },

    async findByEmail(email) {
        const db = await connectToDatabase();
        const user = await db.collection('Users').findOne({ email });
        return user;
    }
};

module.exports = UserModel;
