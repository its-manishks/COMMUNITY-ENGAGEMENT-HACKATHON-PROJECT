const express = require('express');
const multer = require('multer');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route to create a new event, protected by auth middleware
router.post('/', auth, upload.single('image'), async (req, res) => {
    const { title, description, date, location } = req.body;
    const image = req.file.path;

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: user.name,
            organizerEmail: user.email,
            image
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get all events, open to everyone
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Sort by date, earliest first
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to participate in an event, protected by auth middleware
router.post('/participate/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const user = await User.findById(req.user.id).select('-password');
        const participantIndex = event.participants.indexOf(user.id);

        if (participantIndex === -1) {
            event.participants.push(user.id);
        } else {
            event.participants.splice(participantIndex, 1);
        }

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
