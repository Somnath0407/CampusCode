const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtillity");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");

const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { id: problemId } = req.params;
        const { code, language } = req.body;

        if (!problemId || !code || !language) {
            return res.status(400).send("Missing required fields");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem Not Found");
        }

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({ message: `Unsupported language: ${language}` });
        }

        const submissions = problem.visibleTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        if (!Array.isArray(submitResult)) {
            return res.status(502).json({ message: "Judge0 submission failed" });
        }

        const resultTokens = submitResult.map(item => item.token);
        const testResults = await submitToken(resultTokens);
        if (!Array.isArray(testResults)) {
            return res.status(502).json({ message: "Failed to fetch Judge0 results" });
        }

        const results = testResults.map((test, index) => ({
            input: problem.visibleTestCases[index].input,
            expectedOutput: problem.visibleTestCases[index].output,
            stdout: test.stdout,
            stderr: test.stderr,
            compileOutput: test.compile_output,
            statusId: test.status_id ?? test.status?.id,
            statusDescription: test.status?.description,
            passed: (test.status_id ?? test.status?.id) === 3,
            time: test.time,
            memory: test.memory,
        }));

        const testCasesPassed = results.filter(r => r.passed).length;

        res.status(200).json({
            testCasesPassed,
            testCasesTotal: results.length,
            results,
        });
    } catch (err) {
        res.status(500).send("Error:" + err);
    }
};

const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { id: problemId } = req.params;
        const { code, language } = req.body;

        if (!problemId || !code || !language) {
            return res.status(400).send("Missing required fields");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem Not Found");
        }

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({ message: `Unsupported language: ${language}` });
        }

        const allTestCases = [...problem.visibleTestCases, ...problem.hiddenTestCases];

        const submissions = allTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        if (!Array.isArray(submitResult)) {
            return res.status(502).json({ message: "Judge0 submission failed" });
        }

        const resultTokens = submitResult.map(item => item.token);
        const testResults = await submitToken(resultTokens);
        if (!Array.isArray(testResults)) {
            return res.status(502).json({ message: "Failed to fetch Judge0 results" });
        }

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = "";

        for (const test of testResults) {
            const statusId = test.status_id ?? test.status?.id;
            runtime += Number(test.time) || 0;
            memory = Math.max(memory, Number(test.memory) || 0);

            if (statusId === 3) {
                testCasesPassed++;
            } else if (status === "accepted") {
                status = statusId === 6 ? "error" : "wrong";
                errorMessage = test.stderr || test.compile_output || test.status?.description || "";
            }
        }

        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status,
            runtime,
            memory,
            errorMessage,
            testCasesPassed,
            testCasesTotal: allTestCases.length,
        });

        if (status === "accepted") {
            await User.findByIdAndUpdate(userId, { $addToSet: { problemSolved: problemId.toString() } });
        }

        res.status(201).json({
            status,
            testCasesPassed,
            testCasesTotal: allTestCases.length,
            runtime,
            memory,
            errorMessage,
            submissionId: submission._id,
        });
    } catch (err) {
        res.status(500).send("Error:" + err);
    }
};

const getSubmissions = async (req, res) => {
    try {
        const userId = req.result._id;
        const { id: problemId } = req.params;

        if (!problemId) {
            return res.status(400).send("Missing Id Field");
        }

        const submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });
        res.status(200).send(submissions);
    } catch (err) {
        res.status(500).send("Error:" + err);
    }
};

module.exports = { runCode, submitCode, getSubmissions };
