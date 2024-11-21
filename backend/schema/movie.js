const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    actors: [{
        type: String,
        required: true
    }],
    image: {
        type: String,
        default: 'default-movie.jpg'
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', movieSchema);