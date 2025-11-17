const router = require('express').Router();
const { auth, restrictTo } = require('../middleware/auth.js');
const {
    noticeCreate,
    noticeList,
    updateNotice,
    deleteNotice,
    deleteNotices
} = require('../controllers/notice-controller.js');

// Admin Only
router.post('/NoticeCreate', auth, restrictTo('Admin'), noticeCreate);
router.put('/Notice/:id', auth, restrictTo('Admin'), updateNotice);
router.delete('/Notice/:id', auth, restrictTo('Admin'), deleteNotice);
router.delete('/Notices/:id', auth, restrictTo('Admin'), deleteNotices);

// All Users
router.get('/NoticeList/:id', auth, noticeList);

module.exports = router;