const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    complainCreate,
    complainList
} = require('../controllers/complain-controller.js');

// Admin Only
router.get('/ComplainList/:id', auth, restrictTo('Admin'), complainList);

// All Authenticated Users (Admin, Student, Teacher)
router.post('/ComplainCreate', auth, complainCreate);

module.exports = router;