const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const sclassCreate = asyncHandler(async (req, res) => {
    const { sclassName, adminID } = req.body;

    if (!sclassName || !adminID) {
        throw new ApiError(400, "Class name and Admin ID are required");
    }

    const existingSclass = await Sclass.findOne({
        sclassName,
        school: adminID
    });

    if (existingSclass) {
        throw new ApiError(409, "Sorry, this class name already exists");
    }

    const sclass = new Sclass({
        sclassName,
        school: adminID
    });

    const result = await sclass.save();
    
    res.status(201).json(
        new ApiResponse(201, result, "Class created successfully")
    );
});

const sclassList = asyncHandler(async (req, res) => {
    let sclasses = await Sclass.find({ school: req.params.id });
    
    if (!sclasses || sclasses.length === 0) {
        // We send an empty array instead of an error, as this is valid
        return res.status(200).json(
            new ApiResponse(200, [], "No classes found")
        );
    }
    
    res.status(200).json(
        new ApiResponse(200, sclasses, "Classes retrieved successfully")
    );
});

const getSclassDetail = asyncHandler(async (req, res) => {
    const sclass = await Sclass.findById(req.params.id);
    
    if (!sclass) {
        throw new ApiError(404, "Class not found");
    }
    
    res.status(200).json(
        new ApiResponse(200, sclass, "Class details retrieved")
    );
});

const getSclassStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({ sclassName: req.params.id })
        .populate("sclassName", "sclassName"); // Populate class name just in case

    if (!students || students.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No students found in this class")
        );
    }
    
    res.status(200).json(
        new ApiResponse(200, students, "Students retrieved successfully")
    );
});

// ... (Rest of the functions: deleteSclass, deleteSclasses, etc.
// should be refactored in the exact same way)

// Example for deleteSclass
const deleteSclass = asyncHandler(async (req, res) => {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    
    if (!deletedClass) {
        throw new ApiError(404, "Class not found");
    }
    
    // Cascade delete (this is good logic)
    await Student.deleteMany({ sclassName: req.params.id });
    await Subject.deleteMany({ sclassName: req.params.id });
    await Teacher.deleteMany({ teachSclass: req.params.id });
    
    res.status(200).json(
        new ApiResponse(200, deletedClass, "Class and all associated data deleted")
    );
});

// We recommend refactoring all other functions (deleteSclasses) in the same way.

module.exports = {
    sclassCreate,
    sclassList,
    getSclassDetail,
    getSclassStudents,
    deleteSclass
    // ... add your other refactored functions here
};