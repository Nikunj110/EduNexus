const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // <-- IMPORT bcrypt

const adminSchema = new mongoose.Schema({
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
        select: false // <-- ADD THIS: Hides password from default queries
    },
    role: {
        type: String,
        default: "Admin" // <-- 'Admin' (capitalized) is correct
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    }
});

// ADD THIS HOOK: This function will run automatically before any 'save' command
adminSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("admin", adminSchema);