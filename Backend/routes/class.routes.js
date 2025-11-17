const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    sclassCreate,
    sclassList,
    // ... all other class functions
} = require('../controllers/class-controller.js');

router.post('/SclassCreate', auth, restrictTo('Admin'), sclassCreate);
router.get('/SclassList/:id', auth, restrictTo('Admin'), sclassList);
// ... Add all other class routes here, protected by auth ...

module.exports = router;