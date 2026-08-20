const express =require('express');
const authRouter = express.Router();
const {register, login, logout,adminRegister,getProfile} = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleWare');
const adminMiddleware = require('../middleware/adminMiddleware');


//Register
authRouter.post('/register',register);
//Login
authRouter.post('/login',login);
//Logout
authRouter.post('/logout', userMiddleware ,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
//GetProfile
authRouter.get('/profile', userMiddleware, getProfile);

module.exports = authRouter;