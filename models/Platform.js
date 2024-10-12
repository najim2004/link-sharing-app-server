const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bgColor: { type: String, required: true },
  icon: { type: String, required: true },
});
module.exports = mongoose.model("Platforms", PlatformSchema);
