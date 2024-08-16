const express = require('express');
const router = express.Router();
const {SendOtp} = require('../controller/Auth');
const {Signup,Login} = require('../controller/Auth')
const {resetLink,resetPassword} = require('../controller/ResetPassword')
const {Decode,isAdmin,isStudent} =  require('../middleware/Auth');
app.get('/test',Decode,(req,res)=>{
    success:true
    message:'welcome to propected Routes'
});
app.get('/student',Decode,isStudent,(req,res,next)=>{
    success:true
    message:"welcome to  student protected Route"
})
app.get('/admin',Decode,isAdmin,(req,res,next)=>{
    success:true
    message:"welcome to Admin protected Route"
})
router.post('/Signup',Signup);
router.post('/sendotp',SendOtp);
router.post('/Login',Login);
router.post('/sendLink',resetLink)
router.post('/resetPassword',resetPassword);
module.exports = router