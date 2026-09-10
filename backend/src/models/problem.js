const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    tags: {
        type: String,
        enum: [
            'arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking',
            'two-pointers', 'fast-slow-pointers', 'sliding-window', 'kadane', 'prefix-sum', 'merge-intervals',
            'sql',
        ],
        required: true,
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            // Not `required: true` — Mongoose's String required-check also
            // rejects "", but an empty string is a legitimate expected output
            // for SQL problems (a query that correctly produces zero rows).
            output: {
                type: String,
                default: "",
            },
            explanation: {
                type: String,
                required: true,
            },
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            // Not `required: true` — Mongoose's String required-check also
            // rejects "", but an empty string is a legitimate expected output
            // for SQL problems (a query that correctly produces zero rows).
            output: {
                type: String,
                default: "",
            },

        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            },
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true,
            },
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
})

const Problem = mongoose.model("problem", problemSchema);

module.exports = Problem;