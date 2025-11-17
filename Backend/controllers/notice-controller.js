const Notice = require('../models/noticeSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const noticeCreate = asyncHandler(async (req, res) => {
    const { title, details, date } = req.body;
    const schoolId = req.user.role === 'Admin' ? req.user._id : req.user.school;

    if (!title || !details || !date) {
        throw new ApiError(400, "All fields are required");
    }

    const notice = new Notice({ ...req.body, school: schoolId });
    const result = await notice.save();
    res.status(201).json(new ApiResponse(201, result, "Notice created successfully"));
});

const noticeList = asyncHandler(async (req, res) => {
    let notices = await Notice.find({ school: req.params.id });
    if (!notices || notices.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No notices found"));
    }
    res.status(200).json(new ApiResponse(200, notices, "Notices retrieved successfully"));
});

const updateNotice = asyncHandler(async (req, res) => {
    const schoolId = req.user.role === 'Admin' ? req.user._id : req.user.school;
    const result = await Notice.findOneAndUpdate(
        { _id: req.params.id, school: schoolId },
        { $set: req.body },
        { new: true }
    );

    if (!result) {
        throw new ApiError(404, "Notice not found or you don't have permission to edit it");
    }
    res.status(200).json(new ApiResponse(200, result, "Notice updated successfully"));
});

const deleteNotice = asyncHandler(async (req, res) => {
    const schoolId = req.user.role === 'Admin' ? req.user._id : req.user.school;
    const result = await Notice.findOneAndDelete({
        _id: req.params.id,
        school: schoolId
    });

    if (!result) {
        throw new ApiError(404, "Notice not found or you don't have permission to delete it");
    }
    res.status(200).json(new ApiResponse(200, result, "Notice deleted successfully"));
});

const deleteNotices = asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    if (req.user.role !== 'Admin' || req.user._id.toString() !== schoolId) {
         throw new ApiError(403, "You are not authorized");
    }

    const result = await Notice.deleteMany({ school: schoolId });
    res.status(200).json(new ApiResponse(200, result, `${result.deletedCount} notices deleted successfully`));
});

module.exports = { 
    noticeCreate, 
    noticeList, 
    updateNotice, // <-- FIX: Added this line
    deleteNotice, // <-- FIX: Added this line
    deleteNotices // <-- FIX: Added this line
};