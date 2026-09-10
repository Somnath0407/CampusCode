const { getLanguageById, submitBatch, submitToken, buildJudge0Payload } = require("../utils/problemUtillity");
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
            ...buildJudge0Payload(language, code, testcase.input),
            language_id: languageId,
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
        res.status(500).json({ message: err.message || String(err) });
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
            ...buildJudge0Payload(language, code, testcase.input),
            language_id: languageId,
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
        res.status(500).json({ message: err.message || String(err) });
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
        res.status(500).json({ message: err.message || String(err) });
    }
};

// Daily submission counts for one calendar year (defaults to the current
// year), for the GitHub-style activity heatmap on the user dashboard.
// Grouped in UTC so the calendar buckets line up with what the frontend
// renders (see ActivityHeatmap.jsx), which also drives the year switcher.
const getActivityHeatmap = async (req, res) => {
    try {
        const userId = req.result._id;
        const currentYear = new Date().getUTCFullYear();
        const year = Number.parseInt(req.query.year, 10) || currentYear;

        const since = new Date(Date.UTC(year, 0, 1));
        const until = new Date(Date.UTC(year + 1, 0, 1));

        const grouped = await Submission.aggregate([
            { $match: { userId, createdAt: { $gte: since, $lt: until } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const days = grouped.map((g) => ({ date: g._id, count: g.count }));
        const total = days.reduce((sum, d) => sum + d.count, 0);

        res.status(200).json({ year, total, days });
    } catch (err) {
        res.status(500).json({ message: err.message || String(err) });
    }
};

module.exports = { runCode, submitCode, getSubmissions, getActivityHeatmap };
