const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const subjectCreate = asyncHandler(async (req, res) => {
    const { sclassName, subjects } = req.body;
    const schoolId = req.user._id;

    if (!sclassName || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
        throw new ApiError(400, "Class name and a list of subjects are required");
    }

    const subCodes = subjects.map(s => s.subCode);
    const existingSubject = await Subject.findOne({
        subCode: { $in: subCodes },
        school: schoolId
    });

    if (existingSubject) {
        throw new ApiError(409, `Subject code '${existingSubject.subCode}' already exists in this school.`);
    }

    const newSubjects = subjects.map((subject) => ({
        ...subject,
        sclassName: sclassName,
        school: schoolId,
    }));

    const result = await Subject.insertMany(newSubjects);
    res.status(201).json(new ApiResponse(201, result, "Subjects created successfully"));
});

const allSubjects = asyncHandler(async (req, res) => {
    let subjects = await Subject.find({ school: req.params.id })
        .populate("sclassName", "sclassName")
        .populate("teacher", "name");

    if (!subjects || subjects.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No subjects found for this school"));
    }
    res.status(200).json(new ApiResponse(200, subjects, "Subjects retrieved successfully"));
});

const classSubjects = asyncHandler(async (req, res) => {
    let subjects = await Subject.find({ sclassName: req.params.id })
        .populate("teacher", "name");

    if (!subjects || subjects.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No subjects found for this class"));
    }
    res.status(200).json(new ApiResponse(200, subjects, "Class subjects retrieved successfully"));
});

const getSubjectDetail = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
        .populate("sclassName", "sclassName")
        .populate("teacher", "name");

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }
    res.status(200).json(new ApiResponse(200, subject, "Subject details retrieved"));
});

const deleteSubject = asyncHandler(async (req, res) => {
    const subjectId = req.params.id;
    
    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
        throw new ApiError(404, "Subject not found");
    }

    await Teacher.updateMany({ teachSubject: subjectId }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, {
        $pull: {
            examResult: { subName: subjectId },
            attendance: { subName: subjectId }
        }
    });

    res.status(200).json(new ApiResponse(200, deletedSubject, "Subject deleted successfully"));
});

const deleteSubjects = asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    if (req.user.role !== 'Admin' || req.user._id.toString() !== schoolId) {
         throw new ApiError(403, "You are not authorized");
    }

    const subjectsToDelete = await Subject.find({ school: schoolId });
    const subjectIds = subjectsToDelete.map(s => s._id);
    const deletionResult = await Subject.deleteMany({ school: schoolId });

    await Teacher.updateMany({ teachSubject: { $in: subjectIds } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({ school: schoolId }, {
        $pull: {
            examResult: { subName: { $in: subjectIds } },
            attendance: { subName: { $in: subjectIds } }
        }
    });

    res.status(200).json(new ApiResponse(200, deletionResult, `${deletionResult.deletedCount} subjects deleted`));
});

const deleteSubjectsByClass = asyncHandler(async (req, res) => {
    const classId = req.params.id;
    
    const subjectsToDelete = await Subject.find({ sclassName: classId });
    const subjectIds = subjectsToDelete.map(s => s._id);
    const deletionResult = await Subject.deleteMany({ sclassName: classId });
    
    await Teacher.updateMany({ teachSubject: { $in: subjectIds } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({ sclassName: classId }, {
        $pull: {
            examResult: { subName: { $in: subjectIds } },
            attendance: { subName: { $in: subjectIds } }
        }
    });

    res.status(200).json(new ApiResponse(200, deletionResult, `${deletionResult.deletedCount} subjects deleted from class`));
});

const freeSubjectList = asyncHandler(async (req, res) => {
    let subjects = await Subject.find({
        school: req.params.id, // Changed from sclassName to school
        teacher: { $exists: false }
    });

    if (!subjects || subjects.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No free subjects found"));
    }
    res.status(200).json(new ApiResponse(200, subjects, "Free subjects retrieved"));
});

module.exports = {
    subjectCreate,
    allSubjects,
    classSubjects,
    getSubjectDetail,
    deleteSubject,
    deleteSubjects, // <-- FIX: Added this line
    deleteSubjectsByClass, // <-- FIX: Added this line
    freeSubjectList
};