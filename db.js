
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let db;

const connectToDatabase = async () => {
    if (db) return db;

    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        db = client.db(); // Use default database from the connection string, which is Smart_cab as it is only one mentioned in MONGODB_URI in .env
        console.log('MongoDB connected successfully');
        return db;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};
module.exports = connectToDatabase;
