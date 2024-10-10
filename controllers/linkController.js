const Link = require("../models/Link");
const mongoose = require("mongoose");

exports.createLink = async (req, res) => {
  const { url, platform, order } = req.body;
  const { id: userId } = req.params;
  const newLink = new Link({ userId, url, platform, order });
  try {
    await newLink.save();
    res.status(201).json({
      success: true,
      message: "Link created successfully",
      link: newLink,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating link",
      error: error.message,
    });
  }
};

exports.getLinks = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const links = await Link.find({ userId });
    res
      .status(200)
      .json({ success: true, message: "Links retrieved successfully", links });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving links",
      error: error.message,
    });
  }
};

exports.updateLink = async (req, res) => {
  const { id: _id } = req.params;
  const { url, order, platform } = req.body;
  const query = {};

  if (url) {
    if (typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL provided",
      });
    }
    query.url = url.trim();
  }

  if (order !== undefined) {
    if (typeof order !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid order provided; it must be a number",
      });
    }
    query.order = order;
  }

  if (platform) {
    if (typeof platform !== "string" || !platform.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform provided",
      });
    }
    query.platform = platform.trim();
  }

  if (Object.keys(query).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No update provided",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const updatedLink = await Link.findByIdAndUpdate(_id, query, { new: true });
    if (!updatedLink) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Link updated successfully",
      link: updatedLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteLink = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Link.findByIdAndDelete(_id);
    res
      .status(204)
      .json({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting link",
      error: error.message,
    });
  }
};
