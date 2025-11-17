const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    // ... all other student controller functions
} = require('../controllers/student_controller.js');

// We will refactor studentRegister and studentLogIn into auth.controller.js
// router.post('/StudentReg', studentRegister);
// router.post('/StudentLogin', studentLogIn);

// Protect all routes with auth middleware
router.get("/Students/:id", auth, restrictTo('Admin'), getStudents);
router.get("/Student/:id", auth, restrictTo('Admin', 'Teacher', 'Student'), getStudentDetail);
router.delete("/Students/:id", auth, restrictTo('Admin'), deleteStudents);
router.delete("/Student/:id", auth, restrictTo('Admin'), deleteStudent);
router.delete("/StudentsClass/:id", auth, restrictTo('Admin'), deleteStudentsByClass);
router.put("/Student/:id", auth, restrictTo('Admin'), updateStudent);

router.post('/StudentAttendance/:id', auth, restrictTo('Admin', 'Teacher'), studentAttendance);
router.put('/UpdateExamResult/:id', auth, restrictTo('Admin', 'Teacher'), updateExamResult);
// ... add all other student routes here ...

module.exports = router;