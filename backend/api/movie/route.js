const express = require('express');
const router = express.Router();
const Movie = require('../../schema/movie');

router.get('/get', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add', async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publishedYear: req.body.publishedYear,
        image: req.body.image || 'default-cover.jpg' 
    });

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete', async (req, res) => {

});

router.post('/edit', async(req,res) =>{
    
});

module.exports = router;