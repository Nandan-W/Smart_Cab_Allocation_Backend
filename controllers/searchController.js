const connectToDatabase = require('../db');
const geolib = require('geolib');
// const { setCache, getCache, clearCache } = require('../utils/cache');
const { setCache, getCache } = require('../utils/cache');

const searchCabs = async (req, res) => {
    console.log("inside search cabs");
    const { pickupLocation, dropLocation, shareCab } = req.body;

    const cacheKey = `cabs:${pickupLocation.lat}:${pickupLocation.lng}:${dropLocation.lat}:${dropLocation.lng}`;

    // Start timing the search
    const startTime = Date.now();
    console.log("data time started");

    try {
        // Checking if the result is in cache
        console.log("checking cache");
        console.log("Fetching from cache with key:", cacheKey);
        const cachedResult = await getCache(cacheKey).catch((err) => {
            console.error('Error fetching from cache:', err);
            return null; // Return null if there's an error
        });
        
        if (cachedResult) {
            const elapsedTime = Date.now() - startTime;
            // return res.status(200).json(cachedResult); 
        
            // below return statement to measure efficiency of time speedup due to cache
            return res.status(200).json({ results: cachedResult, cache: true, time: elapsedTime });
        }

        console.log("didnt found from cache!");

        const db = await connectToDatabase();
        const availableCabs = await db.collection('cab_locations').find().toArray();

        const sortedCabs = availableCabs.map(cab => {
            const distance = geolib.getDistance(
                { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
                { latitude: parseFloat(cab.currentLocation[1]), longitude: parseFloat(cab.currentLocation[0]) }
            ) / 1000;
            const travelCost = Math.max(100, cab.baseCostPerKm * distance);
            return { ...cab, distance, travelCost };
        });

        // Filtering cabs based on sharing rules
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

        // Cache the results
        await setCache(cacheKey, results, 60); // Cache for 60 seconds

        // res.status(200).json(results);
        
        const elapsedTime = Date.now() - startTime;
        res.status(200).json({ results, cache: false, time: elapsedTime });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cabs', error });
    }
};

// // Clear cache every minute
// const clearCachePeriodically = () => {
//     setInterval(() => {
//         // clearCache();
//     }, 60000); // 1 minute
// };

// // clearing cache on server start
// clearCachePeriodically();

module.exports = {
    searchCabs,
};
