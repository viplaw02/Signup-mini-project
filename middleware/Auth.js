const jwt  = require('jsonwebtoken')
require('dotenv').config();
const{HttpStatusCode} = require('axios')
exports.Decode = (req,res,next)=>{
    try {
        const {token} = req.headers.authorization;
        console.log(token);
        if(!token){
            return res.status(HttpStatusCode.Unauthorized).json({
                success:false,
                message:"token missing"
            });
        const Decode = jwt.verify(token.split('')[1],process.env.JWT_SECRET) 
        console.log(this.Decode);
        req.auth  = {user:Decode}
          if(!Decode){
         return res.status(HttpStatusCode.InternalServerError).json({
            success:false,
            message:"some error found while decoding"
         });
          }        
next()
            
    } 
     }catch (error) {
        console.error(error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success:false,
            message:"internal server error"
        })

    }
}
exports.isAdmin=(req,res,next)=>{
try {
    if(req.auth.Role!=='Admin'){
        return res.status(HttpStatusCode.Unauthorized).json({
            success:false,
            message:"this is protected route for Admin"
        })
        
    }
    else {
        return res.status(HttpStatusCode.Unauthorized).json({
            success:false,
            message:"User Role not Matching"
    });
    next()
}
} catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
        success:false,
        message:"internal Server Error"
    });
}


exports.isStudent = (req, res, next) => {
    try {
        // Check if the user is authenticated and has a role
        if (!req.auth || !req.auth.Role) {
            // If the user is not authenticated (visitor), return a 401 Unauthorized response
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: "You are a visitor, please log in"
            });
        }

        // Check if the user's role is 'Student'
        if (req.auth.Role === 'Student') {
            // If the user is a student, proceed to the next middleware or route handler
            return next();
        } else {
            // If the user is not a student, return a 403 Forbidden response
            return res.status(HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "This is a protected route for Students"
            });
            next();
        }
    } catch (error) {
        console.error(error);
        // Handle any errors that occur in the middleware
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
}
}

