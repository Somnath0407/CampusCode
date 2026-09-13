require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../src/models/problem');

(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  const problem = await Problem.findById('6a8703e86780916f293311f6');
  if (!problem) {
    console.log('Problem not found');
    process.exit(1);
  }
  console.log('Title:', problem.title);
  const target = problem.hiddenTestCases.find(tc => tc.input.trim() === '8\n-2 -1 0 0 1 1 2 2\n2');
  if (!target) {
    console.log('Test case not found. Hidden test cases:', JSON.stringify(problem.hiddenTestCases, null, 2));
    process.exit(1);
  }
  console.log('Before:', JSON.stringify(target.output));
  target.output = '-2 0 2 2\n-2 1 1 2\n-1 0 1 2\n0 0 1 1';
  await problem.save();
  console.log('After:', JSON.stringify(target.output));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
