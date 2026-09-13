const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 6,
        max: 90,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    problemSolved: {
        type: [String],
    },
    password: {
        type: String,
        required: function () { return !this.googleId; },
        minlength: 8,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
    },
},{
    timestamps: true,
})

const User = mongoose.model("user", userSchema);

module.exports = User;