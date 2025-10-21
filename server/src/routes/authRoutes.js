const express = require('express');
const { 
    checkAuth, 
    sendCode, 
    verifyCode, 
    logout, 
    generateQRCode, 
    checkQRLogin, 
    completeQRLogin 
} = require('../controllers/authController');
const router = express.Router();

router.get('/check-auth', checkAuth);
router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.post('/logout', logout);

// QR Code authentication routes
router.post('/qr/generate', generateQRCode);
router.post('/qr/check', checkQRLogin);
router.post('/qr/complete', completeQRLogin);

module.exports = router;
