const mongoose = require('mongoose');

const rentHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    rentedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    plannedReturnDate: {
        type: Date,
        required: true
    },
    actualReturnDate: {
        type: Date
    }
});

module.exports = mongoose.model('RentHistory', rentHistorySchema);