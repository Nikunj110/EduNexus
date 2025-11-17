const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    subjectCreate,
    allSubjects,
    classSubjects,
    getSubjectDetail,
    deleteSubject,
    deleteSubjects,
    deleteSubjectsByClass,
    freeSubjectList
} = require('../controllers/subject-controller.js');

// Admin Routes
router.post('/SubjectCreate', auth, restrictTo('Admin'), subjectCreate);
router.get('/AllSubjects/:id', auth, restrictTo('Admin'), allSubjects);
router.get('/FreeSubjectList/:id', auth, restrictTo('Admin'), freeSubjectList);
router.delete('/Subject/:id', auth, restrictTo('Admin'), deleteSubject);
router.delete('/Subjects/:id', auth, restrictTo('Admin'), deleteSubjects);
router.delete('/SubjectsClass/:id', auth, restrictTo('Admin'), deleteSubjectsByClass);

// Routes for all authenticated users (Admin, Teacher, Student)
router.get('/ClassSubjects/:id', auth, classSubjects);
router.get('/Subject/:id', auth, getSubjectDetail);

module.exports = router;