const express = require('express');
const submitRouter = express.Router();
const { runCode, submitCode, getSubmissions, getActivityHeatmap } = require('../controllers/userSubmission');
const userMiddleware = require('../middleware/userMiddleWare');

submitRouter.post('/run/:id', userMiddleware, runCode);
submitRouter.post('/submit/:id', userMiddleware, submitCode);
submitRouter.get('/activity', userMiddleware, getActivityHeatmap);
submitRouter.get('/:id', userMiddleware, getSubmissions);

module.exports = submitRouter;
