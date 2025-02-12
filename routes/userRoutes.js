import express from 'express'
import bcrypt from 'bcryptjs'
import { jwtAutoMiddleware, generateToken } from '../jwt.js';
import { User } from '../models/user.js'

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, password, age, email, mobileno, address, aadharCardNumber, role } = req.body;

    try {

        // Password length check
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }

        // Check if the mobile number already exists
        const existingMobile = await User.findOne({ mobileno });
        if (existingMobile) {
            return res.status(400).json({ message: 'Mobile number already exists', success: false });
        }

        // Check if the Aadhar Card Number already exists
        const existingAadhar = await User.findOne({ aadharCardNumber });
        if (existingAadhar) {
            return res.status(400).json({ message: 'Aadhar card number already exists', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, password: hashedPassword, age, email, mobileno, address, aadharCardNumber, role,
        });

        const response = await newUser.save();
        const token = generateToken({ id: response.id })

        res.status(201).json({ message: 'User created successfully', user: response, token: token, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', success: false });
    }
});

router.post('/login', async (req, res) => {
    const { aadharCardNumber, password } = req.body;

    if (!aadharCardNumber || !password) {
        return res.status(401).json({ message: 'aadharCardNumber and password are required', success: false });
    }

    try {
        const user = await User.findOne({ aadharCardNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        //Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password', success: false });
        }

        const token = generateToken({ id: user.id });

        res.status(200).json({ message: 'Login successful', token, success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', success: false });
    }
});

router.get('/profile', jwtAutoMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById({ _id: userId });
        res.status(200).json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
})

router.put('/profile/password', jwtAutoMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the decoded JWT token
        const { currentPassword, newPassword } = req.body;

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both currentPassword and newPassword are required', success: false });
        }
        const user = await User.findById(userId);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect', success: false });

        if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters long', success: false });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully', success: true });

    } catch (error) {
        console.error('Profile password update error:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
})

export default router;
