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
    try {
        const movie = new Movie({
            title: req.body.title,
            genre: req.body.genre,
            director: req.body.director,
            duration: req.body.duration,
            rating: req.body.rating,
            description: req.body.description,
            actors: req.body.actors,
            image: req.body.image || 'default-movie.jpg',
            rentedNow: false
        });

        const newMovie = await movie.save();
        res.status(201).json({
            message: 'Movie added successfully',
            movie: newMovie
        });
    } catch (error) {
        // Obsługa specyficznych błędów
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Movie with this title already exists',
                error: error.message
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Ogólny błąd
        res.status(500).json({
            message: 'Error adding movie',
            error: error.message
        });
    }
});

router.delete('/delete', async (req, res) => {

});

router.post('/edit', async(req,res) =>{
    
});

module.exports = router;