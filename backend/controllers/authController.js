const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      message: "all fields required",
    });
  }

  const duplicateEmail = await User.findOne({ email }).exec();
  if (duplicateEmail) {
    return res
      .status(401)
      .json({
        message:
          "This email address already used.Please used other email address",
      });
  }
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //1)check if email and password exist
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  //2)Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  const correct = user.correctPassword(password, user.password);
  if (!user || !(await user.create(password, user.password))) {
    return res.status(401).json({ message: "incorrect email or password" });
  }
  //3)If everything ok,send token to client
  const roles = object.values(user.roles);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
        roles: roles,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie('jwt',refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"None",
    maxAge:7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({accessToken})
});

module.exports = {
  signup,
  login,
};
