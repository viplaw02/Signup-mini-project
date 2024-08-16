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
exports.isStudent = (req,res,next)=>{
    try {
        if(req.auth.Role!=='Student'){
            return res.status(HttpStatusCode.Unauthorized).json({
                success:false,
                message:"this is protected route for Student"
            })
            
        }return res.status(HttpStatusCode.Unauthorized).json({
            success:false,
            message:"You are visitor"
    });

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success:false,
            message:"internal server error"
        }) 
    }
}






