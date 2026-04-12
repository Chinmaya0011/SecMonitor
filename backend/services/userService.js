// services/userService.js
const User = require("../models/User");
const { signToken } = require("../utils/jwt.js");
const { hashPassword, comparePassword } = require("../utils/bcrypt.js");

const login = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password required" };
  }
  const user = await User.findOne({ email });
  if (!user) throw { status: 401, message: "Invalid email or password" };
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw { status: 401, message: "Invalid email or password" };
  const token = signToken({ id: user._id, email: user.email });
  return { user: { id: user._id, email: user.email }, token };
};

const signup = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password required" };
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) throw { status: 400, message: "User already exists" };
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword });
  const token = signToken({ id: user._id, email: user.email });
  return { user: { id: user._id, email: user.email }, token };
};

const getProfile = async (userId) => {
  return await User.findById(userId).select("-password");
};

const getAllProfile = async () => {
  return await User.find();
};

const deleteAllUsers = async () => {
  return await User.deleteMany({});
};

module.exports = { login, signup, getProfile, getAllProfile, deleteAllUsers };
