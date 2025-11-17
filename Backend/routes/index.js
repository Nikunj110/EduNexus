const router = require('express').Router();

// Import all your separated route files
const authRoutes = require('./auth.routes.js');
const studentRoutes = require('./student.routes.js');
const teacherRoutes = require('./teacher.routes.js');
const sclassRoutes = require('./class.routes.js');
const subjectRoutes = require('./subject.routes.js');
const noticeRoutes = require('./notice.routes.js');
const complainRoutes = require('./complain.routes.js');
const adminRoutes = require('./admin.routes.js'); // For admin-specific actions

// Tell the router to use these files based on their prefix
// e.g., all auth routes will be at /auth/login, /auth/register-admin
router.use('/auth', authRoutes);

// All other routes will be prefixed as they were before
// e.g. /Student/:id, /SclassList/:id
// We will update these to be more RESTful (e.g., /students/:id)
// but for now, we'll match the frontend.
router.use('/', studentRoutes);
router.use('/', teacherRoutes);
router.use('/', sclassRoutes);
router.use('/', subjectRoutes);
router.use('/', noticeRoutes);
router.use('/', complainRoutes);
router.use('/', adminRoutes);

module.exports = router;