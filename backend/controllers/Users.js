
const { successResponse, errorResponse } = require("../utils/response");
const userService = require("../services/userService");


// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.login(email, password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return successResponse(res, "Login successful", { user });
  } catch (error) {
    return errorResponse(res, error.message || "Server error", null, error.status || 500);
  }
};


// 📝 SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.signup(email, password);
    return successResponse(res, "Signup successful", { token, user });
  } catch (error) {
    return errorResponse(res, error.message || "Server error", null, error.status || 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return successResponse(res, "Profile fetched successfully", user);
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};

const getAllProfile = async (req, res) => {
  try {
    const users = await userService.getAllProfile();
    return successResponse(res, "Profiles fetched successfully", users);
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};


const deleteAllUsers = async (req, res) => {
  try {
    const result = await userService.deleteAllUsers();
    return successResponse(res, "All users deleted successfully", { deletedCount: result.deletedCount });
  } catch (error) {
    return errorResponse(res, "Server error", error.message, 500);
  }
};
module.exports = { login, signup, getProfile, getAllProfile, deleteAllUsers };