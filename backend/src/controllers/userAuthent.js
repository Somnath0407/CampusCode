const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require("../config/redis");
const { getBearerToken } = require("../utils/auth");

const register = async (req, res) => {

    try{

        //validate the data
        validate(req.body);

        const {firstName, lastName, email, password, age} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            age,
            password: hashedPassword,
            role: "user",
        });

        const token = jwt.sign({_id:user._id, email:email ,role:'user'}, process.env.JWT_SECRET, { expiresIn: 60*60 });
        res.status(201).json({ message: "User Registered Successfully", token });

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

const login = async (req, res) => {

    try{
        const {email, password} = req.body;
        if(!email || typeof email !== "string"){
            throw new Error("Invalid Credentials");
        }
        if(!password || typeof password !== "string"){
            throw new Error("Invalid Credentials");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const match=await bcrypt.compare(password, user.password); //user.password foem db and password from req.body
        if(!match){
            throw new Error("Invalid Credentials");
        }
        const token = jwt.sign({_id:user._id, email:email ,role:user.role}, process.env.JWT_SECRET, { expiresIn: 60*60 });
        res.status(200).json({ message: "User Logged In Successfully", token });
    }
    catch(err){
        res.status(401).send("Error:"+err);
    }
}

const logout = async (req, res) => {
    try{
        const token = getBearerToken(req);
        const payload=jwt.decode(token);
        const ttlSeconds = payload.exp - Math.floor(Date.now() / 1000);
        await redisClient.set(`token:${token}`,  "Blocked");
        if (ttlSeconds > 0) {
            await redisClient.expire(`token:${token}`, ttlSeconds); //Block the token only until it would have expired anyway
        }
        //Token add kar dung Redis ke blocklist
        res.status(200).send("User Logged Out Successfully");
    }
    catch(err){
        res.status(503).send("Error:"+err);
    }
}

const adminRegister = async (req, res) => {

    try{

        //validate the data
        validate(req.body);

        const {firstName, lastName, email, password, age, role} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            age,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
        });

        const token = jwt.sign({_id:user._id, email:email ,role:user.role}, process.env.JWT_SECRET, { expiresIn: 60*60 });  //in this line i change role from User to user ***********
        res.status(201).json({ message: "User Registered Successfully", token });

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

const getProfile = async (req, res) => {
    try{
        const user = req.result;
        res.status(200).send({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            role: user.role,
            problemSolved: user.problemSolved,
            createdAt: user.createdAt,
        });
    }
    catch(err){
        res.status(500).send("Error:"+err);
    }
}

module.exports = {register, login, logout, adminRegister, getProfile};