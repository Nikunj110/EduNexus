const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType' // <-- FIX: Tells Mongoose to look at the 'userType' field
    },
    // ADD THIS FIELD:
    userType: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'] // <-- The names of your user models
    },
    date: {
        type: Date,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    }
});

module.exports = mongoose.model("complain", complainSchema);