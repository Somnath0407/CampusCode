const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');


const localhostPattern = /^http:\/\/localhost:\d+$/;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === process.env.CLIENT_URL || localhostPattern.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);

const InitalizeConnection = async () => {
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("Connected to DB and Redis");
        app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
        
    }catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();

