const connectToDatabase = require('./db'); 
const axios = require('axios');

const googleKey = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;

const cabData = [
    {
        driverName: "Rahul Sharma",
        currentLocation: "Chandni Chowk, Delhi",
        vehicleType: "Sedan",
        vehicleNumber: "DL1ABC1234",
        contactNumber: "98765 43210",
        baseCostPerKm: 10 // Base rate per kilometer
    },
    {
        driverName: "Sita Verma",
        currentLocation: "Rohini Sector 7, Delhi",
        vehicleType: "Hatchback",
        vehicleNumber: "DL1XYZ5678",
        contactNumber: "99876 54321",
        baseCostPerKm: 8
    },
    {
        driverName: "Vikram Singh",
        currentLocation: "Connaught Place, Delhi",
        vehicleType: "SUV",
        vehicleNumber: "DL1PQR9101",
        contactNumber: "98712 34567",
        baseCostPerKm: 9
    },
    {
        driverName: "Aisha Khan",
        currentLocation: "Saket, Delhi",
        vehicleType: "Sedan",
        vehicleNumber: "DL1LMN1213",
        contactNumber: "98765 67890",
        baseCostPerKm: 10
    },
    {
        driverName: "Anil Gupta",
        currentLocation: "Lajpat Nagar, Delhi",
        vehicleType: "Minivan",
        vehicleNumber: "DL1STU1415",
        contactNumber: "95678 12345",
        baseCostPerKm: 9
    },
    {
        driverName: "Priya Desai",
        currentLocation: "Dwarka Sector 21, Delhi",
        vehicleType: "SUV",
        vehicleNumber: "DL1VWX1617",
        contactNumber: "91234 56789",
        baseCostPerKm: 8
    },
    {
        driverName: "Deepak Mehta",
        currentLocation: "Mayur Vihar, Delhi",
        vehicleType: "Hatchback",
        vehicleNumber: "DL1YZA1819",
        contactNumber: "99887 65432",
        baseCostPerKm: 10
    }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCoordinates = async (address) => {
    try {
        const response = await axios.get(`https://geocode.maps.co/search`, {
            params: {
                q: address,
                api_key: googleKey,
            }
        });
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { coordinates: [lon, lat], address }; // Store as [lng, lat]
        }
        return null;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
};

const insertCabData = async () => {
    const db = await connectToDatabase();
    
    // Create an array to hold the formatted cab data
    const formattedCabData = [];
    
    for (const cab of cabData) {
        const coords = await getCoordinates(cab.currentLocation);
        if (coords) {
            formattedCabData.push({
                driverName: cab.driverName,
                currentLocation: coords.coordinates, // [lng, lat]
                currentAddress: coords.address, // Store address separately
                vehicleType: cab.vehicleType,
                vehicleNumber: cab.vehicleNumber,
                contactNumber: cab.contactNumber,
                allowedSharing: true, // Initially allowing sharing
                currentPassengerCount: 0, // Initially 0
                targetLocations: [], // Initially empty
                baseCostPerKm: cab.baseCostPerKm // Set the base cost
            });
        }
        await delay(1000); // Wait for 1 second between requests
    }

    // Delete existing records if necessary
    await db.collection('cab_locations').deleteMany({});

    // Insert the new cab records
    const result = await db.collection('cab_locations').insertMany(formattedCabData);
    console.log(`Inserted ${result.insertedCount} cab records.`);
};

insertCabData().catch(console.error);
