const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    getTeachers,
    getTeacherDetail,
    // ... all other teacher functions
} = require('../controllers/teacher-controller.js');

router.get("/Teachers/:id", auth, restrictTo('Admin'), getTeachers);
router.get("/Teacher/:id", auth, restrictTo('Admin', 'Teacher'), getTeacherDetail);
// ... Add all other teacher routes here, protected by auth ...

module.exports = router;