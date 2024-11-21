const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishedYear: {
        type: Number
    },
    isbn: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        default: 'default-cover.jpg'  // domyślna okładka
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);