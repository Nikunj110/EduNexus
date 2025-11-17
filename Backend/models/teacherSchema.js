const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // <-- IMPORT bcrypt

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false // <-- ADD THIS
    },
    role: {
        type: String,
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    // FIX 2: Updated attendance structure to match controller logic
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        }
    }]
}, { timestamps: true });

// ADD THIS HOOK: This function will run automatically before any 'save' command
teacherSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("teacher", teacherSchema);