const express = require('express');
const router = express.Router();
const User = require('../../schema/user');
const RentHistory = require('../../schema/rent_history');
const bcrypt = require('bcrypt');

router.get('/get', async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
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
            userId: user.id,
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

router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const activeRentals = await RentHistory.find({
            user: req.params.id,
            isReturned: false
        });

        if (activeRentals.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete user with active rentals'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ 
            success: true,
            message: 'User deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const updates = { ...req.body };
        
        if (updates.password && updates.password.trim() !== '') {
            updates.password = await bcrypt.hash(updates.password, 10);
        } else {
            delete updates.password;
        }

        delete updates._id;
        delete updates.role; 

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { 
                new: true, 
                runValidators: true,
                select: '-password' 
            }
        );
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating user',
            error: error.message 
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }
 
        const activeRentals = await RentHistory.find({
            movie: req.params.id,
            isReturned: false
        });
 
        if (activeRentals.length > 0) {
            return res.status(400).json({
                success: false, 
                message: 'Cannot delete movie that is currently rented'
            });
        }
 
        await Movie.findByIdAndDelete(req.params.id);
 
        res.json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 });

module.exports = router;