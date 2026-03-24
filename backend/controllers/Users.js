const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { signToken } = require("../utils/jwt.js");
const { hashPassword, comparePassword } = require("../utils/bcrypt.js");


// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password required", null, 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    // ✅ Use util
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    return successResponse(res, "Login successful", {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};


// 📝 SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password required", null, 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, "User already exists", null, 400);
    }

    // ✅ Use util
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    return successResponse(res, "Signup successful", {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};

module.exports = { login, signup };