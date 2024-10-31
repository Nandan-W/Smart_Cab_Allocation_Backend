const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const result = await UserModel.create(email, hashedPassword);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("user found during login!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("password dont match");
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log("password match");
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.log("error in token creation");
        res.status(500).json({ message: 'Error during login', error });
    }
};
