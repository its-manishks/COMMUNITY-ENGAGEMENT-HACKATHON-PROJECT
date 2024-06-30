const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, description, startDate, endDate, teamMembers } = req.body;
    try {
        const newProject = new Project({ name, description, startDate, endDate, teamMembers });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
