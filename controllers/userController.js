const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Link = require("../models/Link");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profilePicture,
  });

  try {
    await newUser.save();
    res
      .status(201)
      .send({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 60 * 60 * 1000,
    });

    res.send({ success: true, message: "Login successful" });
  } catch (error) {
    res.send({ success: false, message: "Internal server error" });
  }
};
exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  res
    .status(200)
    .send({ success: true, message: "User logged out successfully" });
};

exports.updateUser = async (req, res) => {
  const _id = req?.user?.id;
  const updates = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save();
    res
      .status(200)
      .send({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  const _id = req?.user?.id;

  try {
    const user = await User.findById(_id).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
exports.getUserByPublic = async (req, res) => {
  const { id: _id } = req?.params;

  try {
    const user = await User.findById(_id).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    const links = await Link.find({ userId: _id }).select(
      "-userId -createdAt -updatedAt -__v"
    );

    res.status(200).send({ success: true, user, links });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
