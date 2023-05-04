const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      message: "all fields required",
    });
  }
});

module.exports = {
  signup,
};
