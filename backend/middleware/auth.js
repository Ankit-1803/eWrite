const { verifyJWT } = require("../utils/generateToken");


async function verifyUser(req, res, next) {
   
   try {
     let token = req.headers.authorization.split(" ")[1];

    // Check if Token is valid or not, if not show->> Please Signin
     if(!token) {
         return res.status(400).json({
             success: false,
             message: "Please signin",
         })
     }
 
     try {
         let user = await verifyJWT(token)
         if(!user) {
             return res.status(400).json({
                 success: false,
                 message: "Please signin",
             })  
         }
         req.user = user.id
         next()
     } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
     }
   } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Token missing",
        }) 
   }
}

module.exports = verifyUser