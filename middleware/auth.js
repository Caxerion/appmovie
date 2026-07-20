const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtsecret = process.env.JWT_SECRET;
if(!jwtsecret) throw new Error('JWT_SECRET belum diset di .env');

module.exports = function auth(req, res, next) {
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({message: 'No token provided'});

        const parts = authHeader.trim().split(' ');
        if(parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return res.status(401).json({message: 'Invalid Authorization header format'})
        }

        const token = parts[1];

        jwt.verify(token, jwtsecret, (err,decoded)=> {
            if(err) return res.status(401).json({message: 'Invalid token'});
            req.user = {id:decoded.id, email:decoded.email};
            next();
        });
    }catch(err){
        next(err);
    }
}