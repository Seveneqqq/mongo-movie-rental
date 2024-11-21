const express = require('express');
const router = express.Router();
const User = require('../../schema/user');
const RentHistory = require('../../schema/rent_history');

router.get('/get', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete', async (req, res) => {
    //by id
});

router.post('/edit', async(req,res)=>{
    //by id
})

router.post('/login', async(req,res) =>{

    const email = req.body.email;
    const password = req.body.password;


});

module.exports = router;