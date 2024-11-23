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
       
        const user = new User({
            login: req.body.login,
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
            return res.status(400).json({
                message: 'Validation Error',
                errors: validationError.errors
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
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'User with this login or email already exists'
            });
        }

        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

router.delete('/delete', async (req, res) => {
    //by id
});

router.post('/edit', async(req,res)=>{
    //by id
})

router.post('/login', async (req, res) => {
    try {
        
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                "login": false,
                "message": "Email and password are required"
            });
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                "login": false,
                "message": "User with this email does not exist"
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({
                "login": false,
                "message": "Invalid password"
            });
        }

        res.status(200).json({
            "login": true,
            "role": user.role
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            "login": false,
            "message": "Server error occurred"
        });
    }
});


module.exports = router;