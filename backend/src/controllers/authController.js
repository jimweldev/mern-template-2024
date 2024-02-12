const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const generateAccessToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn:
      process.env.NODE_ENV === "development"
        ? "10y"
        : process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn:
      process.env.NODE_ENV === "development"
        ? "10y"
        : process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Incorrect email address" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  user = await User.findOne({ email }).select(
    "-password -createdAt -updatedAt -__v"
  );

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  // generate access token
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    })
    .status(200)
    .json({ user, accessToken });
};

// Register
const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  }

  const isEmailUsed = await User.findOne({ email });

  if (isEmailUsed) {
    return res.status(400).json({ message: "Email already used" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email is invalid" });
  }

  // prettier-ignore
  if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })) {
    return res.status(400).json({ message: 'Password is not strong enough' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords mismatch" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // try to create
  try {
    let user = await User.create({
      email,
      password: hashedPassword,
    });

    user = await User.findOne({ email }).select(
      "-password -createdAt -updatedAt -__v"
    );

    // generate access token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      })
      .status(201)
      .json({ user, accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Refresh
const refresh = async (req, res) => {
  let { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(204).json({ message: "Refresh token required" });
  }

  try {
    const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById({ _id }).select(
      "-password -createdAt -updatedAt -__v"
    );

    refreshToken = generateRefreshToken(user._id);

    // generate access token
    const accessToken = generateAccessToken(user._id);

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      })
      .status(200)
      .json({ user, accessToken });
  } catch (error) {
    return res
      .clearCookie("refreshToken")
      .status(204)
      .json({ message: "Refresh token required" });
  }
};

// Logout
const logout = async (req, res) => {
  return res
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Successfully logged out" });
};

module.exports = {
  login,
  register,
  refresh,
  logout,
};
