// One-off seed script: inserts the 32-problem SQL bank (backend/scripts/sql-problems.json)
// into MongoDB. Every test case in that file was verified against the real Judge0 SQLite
// engine by scripts/verifySqlProblems.js before being written — this script does not
// re-run Judge0, it trusts that prior verification (same pattern as seedDsaProblems.js).
//
// Usage: node scripts/seedSqlProblems.js
require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../src/models/problem');
const User = require('../src/models/user');
const problems = require('./sql-problems.json');

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.error('No admin user found — create one before seeding.');
        process.exit(1);
    }

    let created = 0, skipped = 0;
    for (const p of problems) {
        const exists = await Problem.findOne({ title: p.title });
        if (exists) { skipped++; continue; }
        await Problem.create({ ...p, problemCreator: admin._id });
        created++;
    }

    console.log(`Created ${created} problems, skipped ${skipped} (already existed).`);
    await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
