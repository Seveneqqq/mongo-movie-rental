const express = require('express');
const router = express.Router();
const RentHistory = require('../../schema/rent_history');
const Movie = require('../../schema/movie');
const User = require('../../schema/user');


router.get('/get', async (req, res) => {
    try {
        const history = await RentHistory.find();
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/get/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    
        const rentals = await RentHistory.find({ user: userId })
            .populate('movie', 'title genre image')
            .sort({ rentedAt: -1 }); 

        const formattedRentals = rentals.map(rental => ({
            id: rental._id,
            movieTitle: rental.movie.title,
            movieGenre: rental.movie.genre,
            movieImage: rental.movie.image,
            rentedAt: rental.rentedAt,
            plannedReturnDate: rental.plannedReturnDate,
            actualReturnDate: rental.actualReturnDate,
            isReturned: rental.isReturned,
            status: rental.isReturned ? 'Returned' : 
                    new Date() > rental.plannedReturnDate ? 'Overdue' : 'Active'
        }));

        const activeRentals = formattedRentals.filter(rental => !rental.isReturned);
        const historicalRentals = formattedRentals.filter(rental => rental.isReturned);

        res.json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            rentals: {
                active: activeRentals,
                historical: historicalRentals,
                statistics: {
                    totalRentals: formattedRentals.length,
                    activeRentals: activeRentals.length,
                    historicalRentals: historicalRentals.length,
                    overdueRentals: formattedRentals.filter(rental => 
                        rental.status === 'Overdue'
                    ).length
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user rentals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rental history',
            error: error.message
        });
    }
});

module.exports = router;