const express = require('express');
const router = express.Router();
const {SendOtp} = require('../controller/Auth');
const {Signup,Login} = require('../controller/Auth')
const {resetLink,resetPassword} = require('../controller/ResetPassword')



router.post('/Signup',Signup);
router.post('/sendotp',SendOtp);
router.post('/Login',Login);
router.post('/sendLink',resetLink)
router.post('/resetPassword',resetPassword);
module.exports = router