const express = require('express');
const router = express.Router();
const Book = require('../../schema/book');

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publishedYear: req.body.publishedYear,
        isbn: req.body.isbn,
        image: req.body.image || 'default-cover.jpg' 
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;