// Verifies the new C++/Java reference solutions (scripts/dsa-cpp-java-solutions.js)
// entirely locally — no Judge0 involved — by splicing each algorithm body into
// that problem's own existing startCode template (same signature, same
// stdin-parsing main()), compiling with g++/javac, and running every visible +
// hidden test case. Only problems where BOTH languages pass 100% of their test
// cases get pushed into MongoDB's referenceSolution array (alongside the
// existing javascript entry — never replacing it).
//
// Usage: node scripts/verifyAndSeedCppJavaSolutions.js [--dry-run]
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const mongoose = require('mongoose');
const Problem = require('../src/models/problem');
const solutions = require('./dsa-cpp-java-solutions.js');

const DRY_RUN = process.argv.includes('--dry-run');

const CPP_EXTRA_INCLUDES = `#include <algorithm>
#include <unordered_map>
#include <set>
#include <climits>
#include <functional>
#include <deque>
#include <cstdlib>
`;

// Splices `body` in place of the starter template's placeholder, reusing
// whatever indentation the closing brace already had (C++ top-level: none;
// Java inside a class: 4 spaces) so the result is syntactically identical
// to the shipped starter code except for the actual logic.
function spliceBody(initialCode, body) {
    const re = /\/\/ Write your code here\n([ \t]*)return [^\n]*;\n([ \t]*)\}/;
    const m = initialCode.match(re);
    if (!m) throw new Error('placeholder pattern not found in starter code');
    return initialCode.slice(0, m.index) + body + '\n' + m[2] + '}' + initialCode.slice(m.index + m[0].length);
}

function buildCpp(startCode, body) {
    let code = spliceBody(startCode, body);
    code = code.replace('#include <string>\nusing namespace std;', '#include <string>\n' + CPP_EXTRA_INCLUDES + 'using namespace std;');
    return code;
}

function buildJava(startCode, body) {
    return spliceBody(startCode, body);
}

function runCpp(sourceCode, stdin) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-cpp-'));
    const srcPath = path.join(dir, 'main.cpp');
    const exePath = path.join(dir, 'main.exe');
    fs.writeFileSync(srcPath, sourceCode);
    const compile = spawnSync('g++', ['-O2', '-std=c++17', srcPath, '-o', exePath], { timeout: 20000, encoding: 'utf8' });
    if (compile.status !== 0) return { error: 'compile', detail: compile.stderr };
    const run = spawnSync(exePath, [], { input: stdin, timeout: 5000, encoding: 'utf8' });
    if (run.error) return { error: 'runtime', detail: String(run.error) };
    if (run.status !== 0) return { error: 'runtime', detail: run.stderr || `exit ${run.status}` };
    return { stdout: run.stdout };
}

function runJava(sourceCode, stdin) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-java-'));
    const srcPath = path.join(dir, 'Main.java');
    fs.writeFileSync(srcPath, sourceCode);
    const compile = spawnSync('javac', [srcPath], { timeout: 20000, cwd: dir, encoding: 'utf8' });
    if (compile.status !== 0) return { error: 'compile', detail: compile.stderr };
    const run = spawnSync('java', ['-cp', dir, 'Main'], { input: stdin, timeout: 5000, encoding: 'utf8' });
    if (run.error) return { error: 'runtime', detail: String(run.error) };
    if (run.status !== 0) return { error: 'runtime', detail: run.stderr || `exit ${run.status}` };
    return { stdout: run.stdout };
}

const norm = (s) => (s || '').trim().replace(/\r\n/g, '\n');

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    // Fetched fresh every run rather than from a cached dump — a stale
    // snapshot would silently diverge from the live test cases (e.g. after
    // an admin edits a problem), and this script needs to grade against
    // whatever data is actually live right now.
    const problems = await Problem.find({ tags: { $ne: 'sql' } }).sort({ _id: 1 });
    console.log(`Loaded ${problems.length} DSA problems from the live database.\n`);

    const results = []; // { title, cpp: {pass, detail}, java: {pass, detail} }

    for (const p of problems) {
        const sol = solutions[p.title];
        if (!sol) { console.log(`SKIP (no solution authored): ${p.title}`); continue; }

        const allTests = [...p.visibleTestCases, ...p.hiddenTestCases];
        const cppStart = p.startCode.find(s => s.language === 'c++')?.initialCode;
        const javaStart = p.startCode.find(s => s.language === 'java')?.initialCode;

        const entry = { title: p.title, _id: p._id, cpp: null, java: null };

        if (cppStart) {
            let code, fail = null;
            try { code = buildCpp(cppStart, sol.cpp); } catch (e) { fail = { stage: 'splice', detail: e.message }; }
            if (!fail) {
                for (const tc of allTests) {
                    const r = runCpp(code, tc.input);
                    if (r.error) { fail = { stage: r.error, detail: r.detail, input: tc.input }; break; }
                    if (norm(r.stdout) !== norm(tc.output)) { fail = { stage: 'mismatch', expected: tc.output, actual: r.stdout, input: tc.input }; break; }
                }
            }
            entry.cpp = fail ? { pass: false, ...fail } : { pass: true, code };
        }

        if (javaStart) {
            let code, fail = null;
            try { code = buildJava(javaStart, sol.java); } catch (e) { fail = { stage: 'splice', detail: e.message }; }
            if (!fail) {
                for (const tc of allTests) {
                    const r = runJava(code, tc.input);
                    if (r.error) { fail = { stage: r.error, detail: r.detail, input: tc.input }; break; }
                    if (norm(r.stdout) !== norm(tc.output)) { fail = { stage: 'mismatch', expected: tc.output, actual: r.stdout, input: tc.input }; break; }
                }
            }
            entry.java = fail ? { pass: false, ...fail } : { pass: true, code };
        }

        results.push(entry);
        const status = (l) => (entry[l] ? (entry[l].pass ? 'OK' : `FAIL(${entry[l].stage})`) : 'n/a');
        console.log(`${p.title}: cpp=${status('cpp')} java=${status('java')}`);
    }

    const failures = results.filter(r => (r.cpp && !r.cpp.pass) || (r.java && !r.java.pass));
    if (failures.length) {
        console.log(`\n${failures.length} problem(s) had a failure:`);
        for (const f of failures) {
            if (f.cpp && !f.cpp.pass) console.log(`\n--- ${f.title} [cpp/${f.cpp.stage}] ---\n${JSON.stringify(f.cpp.detail || f.cpp).slice(0, 500)}\ninput: ${JSON.stringify(f.cpp.input)}\nexpected: ${JSON.stringify(f.cpp.expected)}\nactual: ${JSON.stringify(f.cpp.actual)}`);
            if (f.java && !f.java.pass) console.log(`\n--- ${f.title} [java/${f.java.stage}] ---\n${JSON.stringify(f.java.detail || f.java).slice(0, 500)}\ninput: ${JSON.stringify(f.java.input)}\nexpected: ${JSON.stringify(f.java.expected)}\nactual: ${JSON.stringify(f.java.actual)}`);
        }
    }

    const readyToSeed = results.filter(r => r.cpp?.pass && r.java?.pass);
    console.log(`\n${readyToSeed.length}/${results.length} problems fully verified (both languages, all test cases).`);

    if (DRY_RUN) {
        console.log('--dry-run set, not writing to database.');
        await mongoose.disconnect();
        return;
    }

    if (readyToSeed.length === 0) {
        console.log('Nothing to seed.');
        await mongoose.disconnect();
        return;
    }

    let updated = 0;
    for (const r of readyToSeed) {
        const doc = await Problem.findById(r._id);
        if (!doc) { console.log(`DB doc missing for ${r.title}, skipping.`); continue; }
        const withoutCppJava = doc.referenceSolution.filter(s => s.language !== 'c++' && s.language !== 'cpp' && s.language !== 'java');
        doc.referenceSolution = [
            ...withoutCppJava,
            { language: 'c++', completeCode: r.cpp.code },
            { language: 'java', completeCode: r.java.code },
        ];
        await doc.save();
        updated++;
    }
    console.log(`Updated ${updated} problems in the database with verified C++ and Java reference solutions.`);
    await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
