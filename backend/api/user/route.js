const express = require('express');
const router = express.Router();
const User = require('../../schema/user');
const RentHistory = require('../../schema/rent_history');
const bcrypt = require('bcrypt');

router.get('/get', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const allowedRoles = ['user', 'admin'];
        if (req.body.role && !allowedRoles.includes(req.body.role)) {
            return res.status(400).json({
                message: 'Invalid role. Allowed roles are: user, admin'
            });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists'
            });
        }

        const user = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role || 'user'
        });

        const validationError = user.validateSync();
        if (validationError) {
            const errors = Object.values(validationError.errors).map(error => error.message);
            return res.status(400).json({
                message: 'Validation Error',
                errors: errors
            });
        }

        const newUser = await user.save();
        
        const userResponse = newUser.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                login: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(401).json({
                login: false,
                message: "User with this email does not exist"
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({
                login: false,
                message: "Invalid password"
            });
        }

        res.status(200).json({
            login: true,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            login: false,
            message: "Server error occurred"
        });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/edit', async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;