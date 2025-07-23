const express = require('express');
const { checkAuth, sendCode, verifyCode, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/check-auth', checkAuth);
router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.post('/logout', logout);

module.exports = router;
