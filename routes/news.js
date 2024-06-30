const express = require('express');
const News = require('../models/News');
const auth = require('../middleware/auth');

const router = express.Router();

// Route to add news, protected by auth middleware
router.post('/', auth, async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const newNews = new News({ title, content, author });
        const news = await newNews.save();
        res.json(news);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get all news articles
router.get('/', async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 }); // Sort by date, newest first
        res.json(news);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
