const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('private.key')
exports.verifyToken = (req,res,next)=>{
    const token = req.cookies.acces_token;
    if(!token) {
        return res.status(401).json({massage:"You are not authenticated"})
    }
    jwt.verify(token,privateKey,(err,user)=>{
        if(err) res.status(403).json({massage:"Your token is not valid"});
        req.user = user;
        next()
    })
}
exports.verifyUser = (req,res,next)=>{
    exports.verifyToken(req,res,next, ()=>{
        if(req.user.id===req.params.id || req.user.role === 'admin'){
            next()
        }
        else {
            if(err) return res.status(403).json({massage:"You are not authorized"})
        }
    }) 
}
exports.verifyAdmin = (req,res,next)=>{
    exports.verifyToken(req,res,next, ()=>{
        if(req.user.role === 'admin'){
            next()
        }
        else {
            if(err) return res.status(403).json({massage:"You are not authorized"})
        }
    }) 
}