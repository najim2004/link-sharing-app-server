const Platform = require("../models/Platform");

exports.getplatforms = async (req, res) => {
  try {
    const platforms = await Platform.find().sort({ name: 1 });
    res.status(200).send({
      success: true,
      message: "Platforms retrieved successfully",
      platforms,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error retrieving platforms",
      error: error.message,
    });
  }
};
