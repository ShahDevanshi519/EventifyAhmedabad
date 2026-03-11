const jwt = require('jsonwebtoken');

const ACCESS_SECRET_KEY = 'access_secret_key';

function verifyToken(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({msg:"Token Not Found"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,ACCESS_SECRET_KEY,(err,user) => {
        if(err)
            return res.status(401).json({msg:"Token Expired"});

        req.user = user;
        next();
    })
}

module.exports = verifyToken;