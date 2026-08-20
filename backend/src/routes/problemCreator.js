const express = require('express');
const adminMiddleware=require('../middleware/adminMiddleware');

const problemRouter = express.Router();
const {createProblem,UpdateProblem,DeleteProblem,getProblemById,getProblemByIdAdmin,getAllProblem,solvedAllProblemByUser,getPublicStats}=require('../controllers/userProblem');
const userMiddleware=require('../middleware/userMiddleWare');



problemRouter.post("/create",adminMiddleware, createProblem);
problemRouter.put("/update/:id",adminMiddleware,UpdateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, DeleteProblem);
problemRouter.get("/admin/:id",adminMiddleware, getProblemByIdAdmin);
problemRouter.get("/stats", getPublicStats);


problemRouter.get("/problemById/:id",userMiddleware, getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);

problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser);

module.exports = problemRouter;