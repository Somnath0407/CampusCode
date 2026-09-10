// Verifies every SQL problem's reference solution against the real Judge0
// SQLite engine (language 82) — for each test case, runs `setup + reference`
// as one script and captures the actual stdout. That captured stdout becomes
// the stored "expected output" for the test case, so grading a real user's
// submission later is guaranteed to compare against the same engine's output
// conventions (pipe-separated columns, no headers, NULL as empty string).
//
// Only writes scripts/sql-problems.json if every single test case for every
// problem comes back Accepted (status id 3) — a partial/broken batch never
// gets written, so seeding always has fully-verified data to work with.
//
// Usage: node scripts/verifySqlProblems.js
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const { submitBatch, submitToken } = require('../src/utils/problemUtillity');
const problems = require('./sql-problems-source');

const CHUNK_SIZE = 15;

const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

async function main() {
    // Flatten every test case across every problem into one job list, so we
    // can chunk submissions to Judge0 without caring about problem boundaries.
    const jobs = [];
    problems.forEach((p, pIdx) => {
        p.tests.forEach((t, tIdx) => {
            jobs.push({ pIdx, tIdx, source_code: `${t.setup}\n${p.reference}` });
        });
    });

    console.log(`Verifying ${jobs.length} test cases across ${problems.length} problems...`);

    const results = new Array(jobs.length);
    const chunks = chunk(jobs, CHUNK_SIZE);

    for (let c = 0; c < chunks.length; c++) {
        const batch = chunks[c];
        const submissions = batch.map(j => ({ source_code: j.source_code, language_id: 82, stdin: "" }));
        const submitResult = await submitBatch(submissions);
        if (!Array.isArray(submitResult)) throw new Error("submitBatch did not return an array");
        const tokens = submitResult.map(s => s.token);
        const testResults = await submitToken(tokens);
        if (!Array.isArray(testResults)) throw new Error("submitToken did not return an array");
        testResults.forEach((r, i) => {
            const jobIndex = c * CHUNK_SIZE + i;
            results[jobIndex] = r;
        });
        console.log(`  chunk ${c + 1}/${chunks.length} done`);
    }

    let failures = 0;
    jobs.forEach((job, i) => {
        const r = results[i];
        const statusId = r.status_id ?? r.status?.id;
        const problem = problems[job.pIdx];
        if (statusId !== 3) {
            failures++;
            console.error(`\nFAIL: "${problem.title}" test #${job.tIdx}`);
            console.error(`  status: ${r.status?.description || statusId}`);
            console.error(`  stderr: ${r.stderr}`);
            console.error(`  compile_output: ${r.compile_output}`);
        } else {
            // Stash the verified stdout back onto the source problem's test case.
            // Judge0's stdout is JS null when a query prints nothing at all (not
            // even a blank line) — the Problem schema requires a String, and an
            // empty string is the correct semantic equivalent, so normalize here.
            problem.tests[job.tIdx].output = r.stdout ?? "";
        }
    });

    if (failures > 0) {
        console.error(`\n${failures} test case(s) failed verification. Fix scripts/sql-problems-source.js and re-run. Not writing output.`);
        process.exit(1);
    }

    // Second pass: resubmit every test case WITH expected_output set, exactly
    // like the live run/submit endpoints do, to confirm Judge0's own diffing
    // actually marks a correct answer as Accepted against the captured output
    // (this is what catches e.g. a null-vs-empty-string mismatch that the
    // first pass, which only checked "did it run", wouldn't have caught).
    console.log("\nRe-verifying grading (expected_output round-trip)...");
    const gradingJobs = jobs.map((job, i) => ({ ...job, expected_output: problems[job.pIdx].tests[job.tIdx].output }));
    const gradingResults = new Array(gradingJobs.length);
    for (let c = 0; c < chunks.length; c++) {
        const batch = gradingJobs.slice(c * CHUNK_SIZE, c * CHUNK_SIZE + CHUNK_SIZE);
        const submissions = batch.map(j => ({ source_code: j.source_code, language_id: 82, stdin: "", expected_output: j.expected_output }));
        const submitResult = await submitBatch(submissions);
        const tokens = submitResult.map(s => s.token);
        const testResults = await submitToken(tokens);
        testResults.forEach((r, i) => { gradingResults[c * CHUNK_SIZE + i] = r; });
        console.log(`  chunk ${c + 1}/${chunks.length} done`);
    }

    let gradingFailures = 0;
    gradingJobs.forEach((job, i) => {
        const r = gradingResults[i];
        const statusId = r.status_id ?? r.status?.id;
        if (statusId !== 3) {
            gradingFailures++;
            console.error(`\nGRADING FAIL: "${problems[job.pIdx].title}" test #${job.tIdx} — Judge0 status: ${r.status?.description || statusId}`);
        }
    });
    if (gradingFailures > 0) {
        console.error(`\n${gradingFailures} test case(s) would NOT grade as Accepted against their own expected output. Not writing output.`);
        process.exit(1);
    }
    console.log("Grading round-trip confirmed for all test cases.");

    console.log("\nAll test cases verified. Building scripts/sql-problems.json...");

    const output = problems.map(p => {
        const [visible, ...hidden] = p.tests;
        return {
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            tags: "sql",
            visibleTestCases: [{
                input: visible.setup,
                output: visible.output,
                explanation: visible.explanation || "",
            }],
            hiddenTestCases: hidden.map(t => ({
                input: t.setup,
                output: t.output,
            })),
            startCode: [{ language: "sql", initialCode: p.starter }],
            referenceSolution: [{ language: "sql", completeCode: p.reference }],
        };
    });

    fs.writeFileSync(
        path.join(__dirname, "sql-problems.json"),
        JSON.stringify(output, null, 2) + "\n"
    );

    console.log(`Wrote ${output.length} problems to scripts/sql-problems.json`);
}

main().catch((err) => { console.error(err); process.exit(1); });
