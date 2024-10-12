const mongoose = require("mongoose");
const urlValidator = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};

const LinkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      validate: [urlValidator, "Invalid URL format"],
    },
    platform: {
      name: { type: String, required: true },
      bgColor: { type: String, required: true },
      icon: { type: String, default: "https://example.com" },
    },
    order: { type: Number, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

LinkSchema.index({ url: 1 }, { unique: true });

const Link = mongoose.model("Link", LinkSchema);

Link.createIndexes();

module.exports = Link;
