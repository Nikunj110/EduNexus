const Admin = require('../models/adminSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

// We are DELETING adminRegister and adminLogIn from this file.
// They are now handled by controllers/auth.controller.js

const getAdminDetail = asyncHandler(async (req, res) => {
    // We get the admin from the auth middleware, not from params
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    res.status(200).json(
        new ApiResponse(200, admin, "Admin details retrieved successfully")
    );
});

module.exports = { getAdminDetail };