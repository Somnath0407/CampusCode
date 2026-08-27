const jwt = require('jsonwebtoken');
const user = require('../models/user');
const redisClient = require('../config/redis');
const { getBearerToken } = require('../utils/auth');

const userMiddleware = async (req, res, next) => {
    try{
        const token = getBearerToken(req);
        if(!token){
            throw new Error("Unauthorized");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const {_id}=payload;

        if(!_id){
            throw new Error("Invalid Token");
        }
        const result =  await user.findById(_id);
        if(!result){
            throw new Error("User Not Found");
        }
        //redis ke bolcklist me mein present to nai hai

        const  isblocked =await redisClient.exists(`token:${token}`);
        if(isblocked){
            throw new Error("Token Blocked");
        }
        req.result = result;
        next();
    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

module.exports = userMiddleware;