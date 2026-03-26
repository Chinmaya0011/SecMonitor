const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { signToken } = require("../utils/jwt.js");
const { hashPassword, comparePassword } = require("../utils/bcrypt.js");


// 🔐 LOGIN
// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password required", null, 400);
    }

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "Invalid email or password", null, 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid email or password", null, 401);

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    // ✅ Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,      // JS cannot access cookie
      secure: process.env.NODE_ENV === 'production', // only HTTPS in production
      sameSite: 'strict',  // prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, "Login successful", {
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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return successResponse(res, "Profile fetched successfully", user);
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};

const getAllProfile=async(req,res)=>{
  try{
    const users=await User.find()
    return successResponse(res, "Profiles fetched successfully", users);
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);

  }
}


const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});

    return successResponse(
      res,
      "All users deleted successfully",
      { deletedCount: result.deletedCount }
    );
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};
module.exports = { login, signup, getProfile,getAllProfile,deleteAllUsers };