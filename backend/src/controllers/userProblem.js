const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtillity");
const Problem = require("../models/problem");
const User = require("../models/user");

const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution
        } = req.body;

        if (
            !title ||
            !description ||
            !difficulty ||
            !tags ||
            !Array.isArray(visibleTestCases) ||
            !Array.isArray(hiddenTestCases) ||
            !Array.isArray(startCode) ||
            !Array.isArray(referenceSolution)
        ) {
            return res.status(400).json({
                message: "Invalid request body"
            });
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = await getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({
                    message: `Unsupported language: ${language}`
                });
            }

            const submissions = visibleTestCases.map(testcase => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);

            if (!Array.isArray(submitResult)) {
                console.error("submitBatch response:", submitResult);
                return res.status(400).json({
                    message: "Judge0 submission failed"
                });
            }

            const resultTokens = submitResult.map(item => item.token);

            const testResults = await submitToken(resultTokens);

            if (!Array.isArray(testResults)) {
                console.error("submitToken response:", testResults);
                return res.status(400).json({
                    message: "Failed to fetch Judge0 results"
                });
            }

            for (const test of testResults) {
                if (test.status?.id !== 3 && test.status_id !== 3) {
                    return res.status(400).json({
                        message: `Reference solution failed for ${language}`,
                        error: test.stderr || test.compile_output || test.message
                    });
                }
            }
        }

        const userProblem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator: req.result._id
        });

        return res.status(201).json({
            message: "Problem Created Successfully",
            problem: userProblem
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


const UpdateProblem =async (req, res) => {
    const { id } = req.params;
    const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution
        } = req.body;
    try{
        if(!id){
            return res.status(400).send("Missong Id Field");
        }
        const DsaProblem = await Problem.findById(id);
        if(!DsaProblem){
            return res.status(440).send("Problem Not Found");
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = await getLanguageById(language);
            if (!languageId) {
                return res.status(400).json({
                    message: `Unsupported language: ${language}`
                });
            }
            const submissions = visibleTestCases.map(testcase => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));
            const submitResult = await submitBatch(submissions);

            if (!Array.isArray(submitResult)) {
                console.error("submitBatch response:", submitResult);
                return res.status(400).json({
                    message: "Judge0 submission failed"
                });
            }
            const resultTokens = submitResult.map(item => item.token);
            const testResults = await submitToken(resultTokens);
            if (!Array.isArray(testResults)) {
                console.error("submitToken response:", testResults);
                return res.status(400).json({
                    message: "Failed to fetch Judge0 results"
                });
            }
            for (const test of testResults) {
                if (test.status?.id !== 3 && test.status_id !== 3) {
                    return res.status(400).json({
                        message: `Reference solution failed for ${language}`,
                        error: test.stderr || test.compile_output || test.message
                    });
                }
            }
        }

        const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        res.status(200).send(newProblem);
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

const DeleteProblem = async (req, res) => {
    const {id}=req.params;
    try{
        if(!id){
            return res.status(400).send("Missing Id Field");
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(404).send("Problem Not Found");
        }
        res.status(200).send("Problem Deleted Successfully");
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

const getProblemById = async (req, res) => {
    const {id} = req.params;
    try{
        if(!id){
            return res.status(400).send("Missing Id Field");
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');
        if(!getProblem){
            return res.status(404).send("Problem Not Found");
        }
        res.status(200).send(getProblem);
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

const getProblemByIdAdmin = async (req, res) => {
    const {id} = req.params;
    try{
        if(!id){
            return res.status(400).send("Missing Id Field");
        }
        const getProblem = await Problem.findById(id);
        if(!getProblem){
            return res.status(404).send("Problem Not Found");
        }
        res.status(200).send(getProblem);
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

const getPublicStats = async (req, res) => {
    try{
        const [total, easy, medium, hard] = await Promise.all([
            Problem.countDocuments({}),
            Problem.countDocuments({difficulty: 'easy'}),
            Problem.countDocuments({difficulty: 'medium'}),
            Problem.countDocuments({difficulty: 'hard'}),
        ]);
        res.status(200).send({ total, easy, medium, hard });
    }catch(err){
        res.status(500).send("Error:"+err);
    }
}

const getAllProblem = async (req, res) => {
    try{
        const getProblem = await Problem.find({}).select('_id title difficulty tags');
        if(getProblem.length===0){
            return res.status(404).send("Problem Not Found");
        }
        res.status(200).send(getProblem);
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

const solvedAllProblemByUser = async (req, res) => {
    try{
        const userId = req.result._id;
        const user = await User.findById(userId);
        res.status(200).send(user.problemSolved);
    }catch(err){
        res.status(400).send("Error:"+err);
    }
}

module.exports = { createProblem, UpdateProblem, DeleteProblem, getProblemById, getProblemByIdAdmin, getAllProblem, solvedAllProblemByUser, getPublicStats };