const Complain = require('../models/complainSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const complainCreate = asyncHandler(async (req, res) => {
    // The user's role ("Student", "Teacher", "Admin") is now attached by our auth middleware
    const userRole = req.user.role;
    
    if (!userRole) {
        throw new ApiError(401, "User role not identified");
    }

    const { user, date, complaint, school } = req.body;

    // We get the user ID from the logged-in user (req.user) to be safe
    const complain = new Complain({
        user: req.user._id, // Use the authenticated user's ID
        userType: userRole.toLowerCase(), // 'Student' -> 'student' (to match schema enum)
        date,
        complaint,
        school
    });
    
    const result = await complain.save();
    
    res.status(201).json(
        new ApiResponse(201, result, "Complaint submitted successfully")
    );
});

const complainList = asyncHandler(async (req, res) => {
    // The populate("user", "name") will now work dynamically for students, teachers,
    // and admins because we set up refPath in the model.
    let complains = await Complain.find({ school: req.params.id }).populate("user", "name");
    
    if (!complains || complains.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No complains found")
        );
    }
    
    res.status(200).json(
        new ApiResponse(200, complains, "Complaints retrieved successfully")
    );
});

module.exports = { complainCreate, complainList };