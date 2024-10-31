const redis = require('redis');

const client = redis.createClient({
    host: 'localhost',
    port: 6379,
});

// Handle Redis connection errors
client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Log when successfully connected to Redis
client.on('connect', () => {
    console.log('Connected to Redis');
});

// Function to set cache with expiry
const setCache = async (key, value, expiry = 60) => {
    try {
        // Ensure the client is connected
        if (!client.isOpen) {
            await client.connect();
        }
        await client.setEx(key, expiry, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
};

// Function to get cache
const getCache = async (key) => {
    try {
        // Ensure the client is connected
        if (!client.isOpen) {
            await client.connect();
        }
        const result = await client.get(key);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null;
    }
};

module.exports = {
    setCache,
    getCache,
};
