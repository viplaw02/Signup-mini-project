const { Otp } = require('../model/otpmodel');
const { User } = require('../model/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {HttpStatusCode} = require('axios');


// OTP generation program
exports.SendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email){
           return res.status(HttpStatusCode.Unauthorized).json({
                success:false,
                message:"provide an email"
            })
        }
        const Isfoundemail = await Otp.findOne({ email });

        if (Isfoundemail) {
            return res.status(HttpStatusCode.Unauthorized).json({
                success: false,
                message: "OTP already sent to the email"
            });
        }

        const generateOtp = () => {
            const RandomOtp = crypto.randomInt(100000, 1000000); // 6-digit OTP
            return RandomOtp;
        }
        let uniqueOtp = false;
        let emailOtp;

        while (!uniqueOtp) {
            emailOtp = generateOtp();
            const findOtp = await Otp.findOne({ otp: emailOtp });
            if (!findOtp) {
                uniqueOtp = true;
            }
        }

        const newOtp = new Otp({
            email,
            otp: emailOtp
        });

        await newOtp.save();

        return res.status(HttpStatusCode.Ok).json({
            success: true,
            message: `OTP sent on ${email}`
        });

    } catch (error) {
        console.error("Error during OTP generation:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
//..................verify otp...............................///
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body; // Destructure otp from request body

        if (otp === undefined || otp === null) {
            return res.status(HttpStatusCode.BadRequest).json({ // Use BadRequest for missing OTP
                success: false,
                message: "OTP not provided. Please provide a valid OTP."
            });
        }
       
        // Convert the OTP from request to number
        const otpNumber = Number(otp);

        // Fetch the most recent OTP associated with the email
        const recentOtp = await Otp.findOne({ otp: otpNumber }).sort({ createdAt: -1 }).limit(1);
        
        if (!recentOtp) {
            return res.status(HttpStatusCode.NotFound).json({
                success: false,
                message: "OTP not found for the provided email."
            });
        }
        
        // Convert the OTP from database to number for comparison
        const recentOtpNumber = Number(recentOtp.otp);

        // Check if the provided OTP matches the most recent one
        if (otpNumber !== recentOtpNumber) {
            return res.status(HttpStatusCode.BadRequest).json({
                success: false,
                message: "Invalid OTP. Please provide a valid OTP."
            });
        }

        // OTP is valid
        return res.status(HttpStatusCode.Ok).json({
            success: true,
            message: "OTP verified successfully."
        });

    } catch (error) {
        // Handle any errors that occur during the OTP verification process
        console.error('Error verifying OTP:', error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "An error occurred while verifying the OTP. Please try again."
        });
    }
};


//.................Signup.........................................//



exports.Signup = async (req, res) => {
    try {
        const { FirstName, LastName, email, Password, ConfirmPassword ,Gender,Role } = req.body;
        
        // Check if all fields are filled
        if (!FirstName || !LastName || !email || !Password || !ConfirmPassword||!Gender||!Role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the data"
            });
        }
        
        // Check if password and confirm password match
        if (Password !== ConfirmPassword) {
            return res.status(HttpStatusCode.BadRequest).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Check if the user already exists
        const FindUser = await User.findOne({ email });
        if (FindUser) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        // Assuming you have an Otp model and a way to get the most recent OTP
     

        // Create a new user
        const payload = new User({
            firstname: FirstName,
            lastname: LastName,
            email,
            password: ConfirmPassword,// password will be hashed in the pre-save hook
            Role
        });

        const NewUser = await payload.save();
        if (NewUser) {
            return res.status(HttpStatusCode.Ok).json({
                success: true,
                payload: NewUser,
                message: "Successfully submitted data"
            });
        }

    } catch (error) {
        console.error("Error handling request:", error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "User cannot be registered, please try again."
        });
    }
};
//.......................lOGIN..................................//
exports.Login = async (req,res)=>{
try {
    const {email,password} = req.body;
if(!email || !password){
    return res.status(HttpStatusCode.BadRequest).json({
        success:false,
        message:"email and password both are required"
    });
}
const FindUser = await User.findOne({email});
if(!FindUser){
    return res.status(HttpStatusCode.Unauthorized).json({
        success:false,
        message:"user does not exits.please Signup"
    })
}
const IsfoundPassword =  await bcrypt.compare(password,FindUser.password);
if(!IsfoundPassword){
    return res.status(HttpStatusCode.Unauthorized).json({
        success:false,
        message:"please enter valid password"
    })
}
const payload ={
    email: FindUser.email,
    _id:FindUser._id,
    Role:FindUser.Role
}
const token = jwt.sign(payload,process.env.JWT_SECRET,{
    expiresIn:'2m'
})
const option = {
   expires: new Date(Date.now() + 300000), // 5 minutes
    httpOnly:true,
    sameSite:"Strict"
}
res.cookie('token',token,option);
FindUser.password=undefined
return res.status(HttpStatusCode.Ok).json({
    success: true,
    findUser: FindUser,
    token,
    message: "Successfully logged in"
});
} catch (error) {
        console.error("Error handling request:", error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "user can not registered please try again."
        });

}
}
