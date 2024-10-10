const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: { type: String, required: true },
    platform: {
      name: { type: String, required: true },
      bgColor: { type: String, required: true },
      icon: { type: String, required: true },
    },
    order: { type: Number, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Link", LinkSchema);
