const { setCache, getCache } = require('./utils/cache');

// Example function to test cache
const testCache = async () => {
    await setCache('test_key', { message: 'Hello, Redis!' });
    const value = await getCache('test_key');
    console.log(value); // Should log: { message: 'Hello, Redis!' }
};

testCache();
