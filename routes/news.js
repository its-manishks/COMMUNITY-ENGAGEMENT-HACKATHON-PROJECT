const express = require('express');
const News = require('../models/News');

const router = express.Router();

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
