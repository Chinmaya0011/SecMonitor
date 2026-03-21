const User=require('../models/User')
const { successResponse, errorResponse } = require("../utils/response");

exports.getUser = async (req, res) => {
  try {
    const user = { id: 1, name: "Chinu" };

    return successResponse(res, "User fetched", user);

  } catch (err) {
    return errorResponse(res, "Something went wrong", err.message);
  }
};
const login = async (req, res) => {
  try {
    // ✅ Safe body check
    if (!req.body) {
      return errorResponse(res, "No data received", null, 400);
    }

    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return errorResponse(res, "Email and password required", null, 400);
    }

    const user = await User.findOne({ email });

    // ✅ Safe null check
    if (!user) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    // ✅ Password check
    if (user.password !== password) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    return successResponse(res, "Login successful", { email: user.email }, 200);

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 check terminal
    return errorResponse(res, "Server error", error.message, 500);
  }
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, "User already exists", null, 400);
    }

    // create user (plain password ❗)
    const user = await User.create({
      email,
      password,
    });

    return successResponse(res, "Signup successful", { email: user.email }, 201);

  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};



module.exports = { login, signup };