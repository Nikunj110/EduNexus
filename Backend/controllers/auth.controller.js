const Admin = require('../models/adminSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

/**
 * Generates a JWT token
 * @param {string} userId - The user's ID
 * @param {string} role - The user's role
 */
const generateToken = (userId, role) => {
    // We get this secret from our .env file, which we must add
    return jwt.sign(
        { id: userId, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

/**
 * @desc    Register a new Admin
 * @route   POST /auth/register-admin
 * @access  Public
 */
const registerAdmin = asyncHandler(async (req, res) => {
    // We deconstruct with the exact names from the frontend (AdminRegisterPage.tsx)
    const { adminName, email, password, schoolName } = req.body;

    if (!adminName || !email || !password || !schoolName) {
        throw new ApiError(400, "All fields are required");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this email already exists"); // 409 Conflict
    }

    // We create the admin by mapping frontend names (adminName) to backend schema names (name)
    const admin = await Admin.create({
        name: adminName,
        email,
        password,
        schoolName
    });
    // Note: Password hashing is now handled automatically by the pre-save hook in adminSchema.js

    const createdAdmin = await Admin.findById(admin._id).select("-password");

    res.status(201).json(
        new ApiResponse(201, createdAdmin, "Admin registered successfully. Please log in.")
    );
});

/**
 * @desc    Login user (Admin, Student, or Teacher)
 * @route   POST /auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    // We get all possible fields from the frontend's LoginPage.tsx
    const { role, email, password, rollNum, studentName } = req.body;

    let user;

    if (role === 'Admin') {
        if (!email || !password) throw new ApiError(400, "Email and password are required");
        // We must .select('+password') because we set 'select: false' in the model
        user = await Admin.findOne({ email }).select('+password');
    } 
    else if (role === 'Teacher') {
        if (!email || !password) throw new ApiError(400, "Email and password are required");
        user = await Teacher.findOne({ email }).select('+password');
    } 
    else if (role === 'Student') {
        if (!rollNum || !studentName || !password) throw new ApiError(400, "Roll Number, Name, and Password are required");
        // FIX: We query the 'name' field using the 'studentName' variable from the frontend
        user = await Student.findOne({ 
            rollNum, 
            name: studentName 
        }).select('+password');
    } 
    else {
        throw new ApiError(400, "Invalid role specified");
    }

    if (!user) {
        throw new ApiError(404, "User not found with these credentials");
    }

    // Check if password matches the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials"); // 401 Unauthorized
    }

    // Password is correct, generate a token
    const token = generateToken(user._id, user.role);

    // Get the user data again, this time *without* the password, but *with* populated data
    let loggedInUser;
    if (role === 'Admin') {
        loggedInUser = await Admin.findById(user._id);
    }
    if (role === 'Teacher') {
        loggedInUser = await Teacher.findById(user._id)
            .populate("teachSubject", "subName sessions")
            .populate("teachSclass", "sclassName")
            .populate("school", "schoolName");
    }
    if (role === 'Student') {
        loggedInUser = await Student.findById(user._id)
            .populate("sclassName", "sclassName")
            .populate("school", "schoolName");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { user: loggedInUser, token: token },
            "Login successful"
        )
    );
});

module.exports = {
    registerAdmin,
    loginUser
};