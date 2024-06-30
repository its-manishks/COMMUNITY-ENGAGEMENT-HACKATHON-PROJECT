const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teamMembers: { type: [String], required: true }
});

module.exports = mongoose.model('Project', ProjectSchema);
