const express = require('express');
const router = express.Router();
const { SendOtp, Signup, Login, verifyOtp } = require('../controller/Auth');
const { resetLink, resetPassword } = require('../controller/ResetPassword');
const { Decode, isAdmin, isStudent } = require('../middleware/Auth');
const { unHashed } = require('../controller/dcode');

router.get('/test', Decode, (req, res) => {
    res.json({
        success: true,
        message: 'welcome to protected Routes'
    });
});

router.get('/admin', Decode, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "welcome to Admin protected Route"
    });
});

// router.get('/student', Decode, isStudent, (req, res) => {
//     res.json({
//         success: true,
//         message: "welcome to student protected Route"
//     });
// });
router.post('/unhashed',unHashed)
router.post('/Signup', Signup);
router.post('/sendotp', SendOtp);
router.post('/verifyotp', verifyOtp);
router.post('/Login', Login);
router.post('/sendLink', resetLink);
router.post('/resetPassword', resetPassword);

module.exports = router;
