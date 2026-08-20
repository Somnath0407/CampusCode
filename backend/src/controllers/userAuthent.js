const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require("../config/redis");

const register = async (req, res) => {

    try{

        //validate the data
        validate(req.body);

        const {firstName, email, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, email:email ,role:'user'}, process.env.JWT_SECRET, { expiresIn: 60*60 });
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("User Registered Successfully");

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

const login = async (req, res) => {

    try{
        const {email, password} = req.body;
        if(!email){
            throw new Error("Invalid Credentials");
        }
        if(!password){
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
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).send("User Logged In Successfully");
    }
    catch(err){
        res.status(401).send("Error:"+err);
    }
}

const logout = async (req, res) => {
    try{
        const {token} = req.cookies;
        const payload=jwt.decode(token);
        await redisClient.set(`token:${token}`,  "Blocked");
        await redisClient.expire(`token:${token}`, payload.exp); //Token ko 1 hour ke liye block kar dena
        //Token add kar dung Redis ke blocklist
        //Cookies ko clear kar dena .....
        res.cookie("token",null,{expires: new Date(Date.now())});
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

        const {firstName, email, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, email:email ,role:user.role}, process.env.JWT_SECRET, { expiresIn: 60*60 });  //in this line i change role from User to user ***********
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("User Registered Successfully");

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