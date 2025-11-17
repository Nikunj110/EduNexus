const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const teacherRegister = asyncHandler(async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;

    if (!name || !email || !password || !school || !teachSubject || !teachSclass) {
        throw new ApiError(400, "All fields are required");
    }

    const existingTeacher = await Teacher.findOne({ email, school });
    if (existingTeacher) {
        throw new ApiError(409, "Email already exists in this school");
    }

    const teacher = new Teacher({ name, email, password, role, school, teachSubject, teachSclass });
    let result = await teacher.save();
    
    await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
    
    result.password = undefined;
    res.status(201).json(new ApiResponse(201, result, "Teacher registered successfully"));
});

// DELETED teacherLogIn - This is now in auth.controller.js

const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find({ school: req.params.id })
        .populate("teachSubject", "subName")
        .populate("teachSclass", "sclassName");

    if (!teachers || teachers.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No teachers found"));
    }
    res.status(200).json(new ApiResponse(200, teachers, "Teachers retrieved successfully"));
});

const getTeacherDetail = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id)
        .populate("teachSubject", "subName sessions")
        .populate("teachSclass", "sclassName")
        .populate("school", "schoolName");

    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    res.status(200).json(new ApiResponse(200, teacher, "Teacher details retrieved successfully"));
});

const deleteTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.params.id;
    
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
        throw new ApiError(404, "Teacher not found");
    }

    await Subject.updateMany({ teacher: teacherId }, { $unset: { teacher: "" } });
    res.status(200).json(new ApiResponse(200, deletedTeacher, "Teacher deleted successfully"));
});

const deleteTeachers = asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    if (req.user.role !== 'Admin' || req.user._id.toString() !== schoolId) {
         throw new ApiError(403, "You are not authorized");
    }

    const teachersToDelete = await Teacher.find({ school: schoolId });
    const teacherIds = teachersToDelete.map(t => t._id);
    const deletionResult = await Teacher.deleteMany({ school: schoolId });

    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: "" } });
    res.status(200).json(new ApiResponse(200, deletionResult, `${deletionResult.deletedCount} teachers deleted`));
});

const deleteTeachersByClass = asyncHandler(async (req, res) => {
    const classId = req.params.id;

    const teachersToDelete = await Teacher.find({ teachSclass: classId });
    const teacherIds = teachersToDelete.map(t => t._id);
    const deletionResult = await Teacher.deleteMany({ teachSclass: classId });
    
    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: "" } });
    res.status(200).json(new ApiResponse(200, deletionResult, `${deletionResult.deletedCount} teachers deleted from class`));
});

const updateTeacherSubject = asyncHandler(async (req, res) => {
    const { teacherId, newSubjectId } = req.body;
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }

    if (teacher.teachSubject) {
        await Subject.findByIdAndUpdate(teacher.teachSubject, { $unset: { teacher: "" } });
    }
    
    await Subject.findByIdAndUpdate(newSubjectId, { teacher: teacherId });
    teacher.teachSubject = newSubjectId;
    
    const result = await teacher.save();
    res.status(200).json(new ApiResponse(200, result, "Teacher's subject updated"));
});

const teacherAttendance = asyncHandler(async (req, res) => {
    const { status, date } = req.body;
    const teacherId = req.params.id;

    if (!status || !date) {
        throw new ApiError(400, "Status and date are required");
    }
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    
    const attendanceDate = new Date(date);
    const existingAttendance = teacher.attendance.find(
        (a) => a.date.toDateString() === attendanceDate.toDateString()
    );

    if (existingAttendance) {
        existingAttendance.status = status;
    } else {
        teacher.attendance.push({ date: attendanceDate, status });
    }

    const result = await teacher.save();
    res.status(200).json(new ApiResponse(200, result, "Teacher attendance marked"));
});

module.exports = {
    teacherRegister,
    getTeachers,
    getTeacherDetail,
    deleteTeacher,
    deleteTeachers, // <-- FIX: Added this line
    deleteTeachersByClass, // <-- FIX: Added this line
    updateTeacherSubject, // <-- FIX: Added this line
    teacherAttendance // <-- FIX: Added this line
};