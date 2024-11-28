const express = require('express');
const router = express.Router();
const Movie = require('../../schema/movie');
const User = require('../../schema/user');
const RentHistory = require('../../schema/rent_history');
router.get('/get', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const RENT_LIMIT = 2; 
const RENT_DURATION_DAYS = 2; 

router.get('/get-full-history', async (req, res) => {
    try {
        const rentals = await RentHistory.find()
            .populate('user', 'firstName lastName email') // Pobierz wybrane pola z modelu User
            .populate('movie', 'title genre image') // Pobierz wybrane pola z modelu Movie
            .sort({ rentedAt: -1 }); // Sortuj od najnowszych

        if (!rentals) {
            return res.status(404).json({
                success: false,
                message: 'No rental history found'
            });
        }

        res.json({
            success: true,
            rentals: rentals
        });
    } catch (error) {
        console.log(error);
        console.error('Error fetching full rental history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rental history',
            error: error.message
        });
    }
});

router.post('/rent', async (req, res) => {
    try {
        const { movieId, userId } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (movie.rentedNow) {
            return res.status(400).json({
                success: false,
                message: 'Movie is currently rented'
            });
        }

        const activeRentals = await RentHistory.countDocuments({
            user: userId,
            isReturned: false
        });

        if (activeRentals >= RENT_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `User has reached the maximum rental limit of ${RENT_LIMIT} movies`
            });
        }

        const rentedAt = new Date();
        const plannedReturnDate = new Date(rentedAt);
        plannedReturnDate.setDate(plannedReturnDate.getDate() + RENT_DURATION_DAYS);

        const rentHistory = new RentHistory({
            user: userId,
            movie: movieId,
            rentedAt: rentedAt,
            plannedReturnDate: plannedReturnDate,
            isReturned: false
        });

        movie.rentedNow = true;

        await Promise.all([
            rentHistory.save(),
            movie.save()
        ]);

        const populatedRentHistory = await RentHistory.findById(rentHistory._id)
            .populate('user', 'firstName lastName email')
            .populate('movie', 'title');

        res.status(200).json({
            success: true,
            message: 'Movie rented successfully',
            rentDetails: {
                movie: populatedRentHistory.movie,
                user: populatedRentHistory.user,
                rentedAt: populatedRentHistory.rentedAt,
                plannedReturnDate: populatedRentHistory.plannedReturnDate
            }
        });

    } catch (error) {
        console.error('Rent error:', error);
        res.status(500).json({
            success: false,
            message: 'Error while renting movie',
            error: error.message
        });
    }
});


router.put('/return', async (req, res) => {
    try {
        const { movieId } = req.body;

        const rentId = movieId.id || movieId; 
        console.log(movieId);
        // Find and update rental record first
        const rental = await RentHistory.findByIdAndUpdate(
            rentId,
            {
                isReturned: true,
                actualReturnDate: new Date()
            },
            { new: true }
        ).populate('movie');

        if (!rental) {
            return res.status(404).json({
                success: false,
                message: 'Rental record not found'
            });
        }

        // Update movie status using the movie ID from the rental record
        const movie = await Movie.findByIdAndUpdate(
            rental.movie._id,
            { rentedNow: false },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.json({
            success: true,
            message: 'Movie returned successfully',
            rental: rental
        });

    } catch (error) {
        console.error('Error returning movie:', error);
        res.status(500).json({
            success: false,
            message: 'Error returning movie',
            error: error.message
        });
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

        res.status(500).json({
            message: 'Error adding movie',
            error: error.message
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }
        res.json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting movie',
            error: error.message
        });
    }
});

router.put('/edit/:id', async(req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre: req.body.genre,
                director: req.body.director,
                duration: req.body.duration,
                rating: req.body.rating,
                description: req.body.description,
                actors: req.body.actors,
                image: req.body.image
            },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.json({
            success: true,
            message: 'Movie updated successfully',
            movie: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating movie',
            error: error.message
        });
    }
});

module.exports = router;