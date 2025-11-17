const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

// DELETED studentRegister and studentLogIn functions.

const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({ school: req.params.id })
        .populate("sclassName", "sclassName");

    if (!students || students.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No students found"));
    }
    res.status(200).json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const getStudentDetail = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
        .populate("sclassName", "sclassName")
        .populate("school", "schoolName")
        .populate("examResult.subName", "subName")
        .populate("attendance.subName", "subName");

    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    res.status(200).json(new ApiResponse(200, student, "Student details retrieved successfully"));
});

const deleteStudent = asyncHandler(async (req, res) => {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) {
        throw new ApiError(404, "Student not found");
    }
    res.status(200).json(new ApiResponse(200, result, "Student deleted successfully"));
});

const deleteStudents = asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    if (req.user.role !== 'Admin' || req.user._id.toString() !== schoolId) {
         throw new ApiError(403, "You are not authorized");
    }
    const result = await Student.deleteMany({ school: schoolId });
    res.status(200).json(new ApiResponse(200, result, `${result.deletedCount} students deleted`));
});

const deleteStudentsByClass = asyncHandler(async (req, res) => {
    const classId = req.params.id;
    const result = await Student.deleteMany({ sclassName: classId });
    res.status(200).json(new ApiResponse(200, result, `${result.deletedCount} students deleted from class`));
});

const updateStudent = asyncHandler(async (req, res) => {
    const result = await Student.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!result) {
        throw new ApiError(404, "Student not found");
    }
    res.status(200).json(new ApiResponse(200, result, "Student updated successfully"));
});

const studentAttendance = asyncHandler(async (req, res) => {
    const { subName, status, date } = req.body;
    const studentId = req.params.id;

    if (!subName || !status || !date) {
        throw new ApiError(400, "Subject, status, and date are required");
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const attendanceDate = new Date(date);
    const existingAttendance = student.attendance.find(a => 
        a.subName.toString() === subName &&
        a.date.toDateString() === attendanceDate.toDateString()
    );

    if (existingAttendance) {
        existingAttendance.status = status;
    } else {
        student.attendance.push({ subName, status, date: attendanceDate });
    }

    const result = await student.save();
    res.status(200).json(new ApiResponse(200, result, "Attendance marked successfully"));
});

const updateExamResult = asyncHandler(async (req, res) => {
    const { subName, marksObtained } = req.body;
    const studentId = req.params.id;

    if (!subName || marksObtained === undefined) {
        throw new ApiError(400, "Subject and marks are required");
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const existingResult = student.examResult.find(r => r.subName.toString() === subName);

    if (existingResult) {
        existingResult.marksObtained = marksObtained;
    } else {
        student.examResult.push({ subName, marksObtained });
    }

    const result = await student.save();
    res.status(200).json(new ApiResponse(200, result, "Marks updated successfully"));
});

const clearAllStudentsAttendance = asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    if (req.user.role !== 'Admin' || req.user._id.toString() !== schoolId) {
         throw new ApiError(403, "You are not authorized");
    }
    
    await Student.updateMany({ school: schoolId }, { $set: { attendance: [] } });
    res.status(200).json(new ApiResponse(200, null, "All student attendance cleared"));
});

module.exports = {
    getStudents,
    getStudentDetail,
    deleteStudents, // <-- FIX: Added this line
    deleteStudent,
    updateStudent, // <-- FIX: Added this line
    studentAttendance,
    deleteStudentsByClass, // <-- FIX: Added this line
    updateExamResult,
    clearAllStudentsAttendance // <-- FIX: Added this line
    // The other "removeAttendance" functions were not in your original route.js,
    // so we will leave them un-exported for now.
};