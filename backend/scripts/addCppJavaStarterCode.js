// Adds C++ and Java starter code entries to the 50 seeded DSA problems (backend/scripts
// dsa-50-problems.json), matched by title via dsa-id-title-map.json. Every stub was compiled
// and run (g++ / javac+java) against all 4 test cases per problem before being written to
// cpp-java-starter-code.json — this script does not re-verify, it trusts that prior check.
// Idempotent: skips a language already present on a problem's startCode array.
//
// Usage: node scripts/addCppJavaStarterCode.js
require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../src/models/problem');
const idTitleMap = require('./dsa-id-title-map.json');
const cppJava = require('./cpp-java-starter-code.json');

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    let updated = 0, skipped = 0, missing = 0;
    for (const { id, title } of idTitleMap) {
        const problem = await Problem.findOne({ title });
        if (!problem) { console.log(`Not found: ${title}`); missing++; continue; }

        const existingLangs = new Set(problem.startCode.map((s) => s.language.toLowerCase()));
        let changed = false;
        if (!existingLangs.has('c++') && !existingLangs.has('cpp')) {
            problem.startCode.push({ language: 'c++', initialCode: cppJava[id].cpp });
            changed = true;
        }
        if (!existingLangs.has('java')) {
            problem.startCode.push({ language: 'java', initialCode: cppJava[id].java });
            changed = true;
        }
        if (changed) { await problem.save(); updated++; } else { skipped++; }
    }

    console.log(`Updated ${updated}, skipped ${skipped} (already had both languages), missing ${missing}.`);
    await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
