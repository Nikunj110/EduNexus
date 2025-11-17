const router = require('express').Router();
// We will create this controller in the next step
const { registerAdmin, loginUser } = require('../controllers/auth.controller.js');

// These match the new frontend's API calls
router.post('/register-admin', registerAdmin);
router.post('/login', loginUser);

module.exports = router;