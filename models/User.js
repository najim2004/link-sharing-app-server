const mongoose = require("mongoose");

const emailValidator = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const urlValidator = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [emailValidator, "Invalid email format"],
    },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      required: true,
      unique: true,
      validate: [urlValidator, "Invalid URL format for profile picture"],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("User", UserSchema);
