const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    getAdminDetail
} = require('../controllers/admin-controller.js');

// Admin Only
router.get('/Admin/:id', auth, restrictTo('Admin'), getAdminDetail);

module.exports = router;