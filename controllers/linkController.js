const Link = require("../models/Link");
const mongoose = require("mongoose");

exports.createLink = async (req, res) => {
  const { url, platform } = req.body;
  const userId = req?.user?.id;

  if (!url || !platform) {
    return res.send({
      success: false,
      message: "URL and platform are required.",
    });
  }

  let linkCount;
  try {
    linkCount = await Link.countDocuments({ userId });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error counting links",
      error: error.message,
    });
  }

  const newLink = new Link({ userId, url, platform, order: linkCount + 1 });

  try {
    await newLink.save();
    res.status(201).send({
      success: true,
      message: "Link created successfully",
      link: newLink,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.send({
        success: false,
        message: error.message,
      });
    }
    if (error.code === 11000) {
      return res.send({
        success: false,
        message: "This URL already exists. Please use a different URL.",
      });
    }
    res.send({
      success: false,
      message: "Error creating link",
      error: error.message,
    });
  }
};

exports.getLinks = async (req, res) => {
  const { id: userId } = req?.params;
  try {
    const links = await Link.find({ userId });
    res
      .status(200)
      .send({ success: true, message: "Links retrieved successfully", links });
  } catch (error) {
    res.send({
      success: false,
      message: "Error retrieving links",
      error: error.message,
    });
  }
};

exports.updateLink = async (req, res) => {
  const _id = req?.user?.id;
  const { url, order, platform } = req.body;
  const query = {};

  if (url) {
    if (typeof url !== "string" || !url.trim()) {
      return res.send({
        success: false,
        message: "Invalid URL provided",
      });
    }
    query.url = url.trim();
  }

  if (order !== undefined) {
    if (typeof order !== "number") {
      return res.send({
        success: false,
        message: "Invalid order provided; it must be a number",
      });
    }
    query.order = order;
  }

  if (platform) {
    if (typeof platform !== "string" || !platform.trim()) {
      return res.send({
        success: false,
        message: "Invalid platform provided",
      });
    }
    query.platform = platform.trim();
  }

  if (Object.keys(query).length === 0) {
    return res.send({
      success: false,
      message: "No update provided",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.send({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const updatedLink = await Link.findByIdAndUpdate(_id, query, { new: true });
    if (!updatedLink) {
      return res.send({
        success: false,
        message: "Link not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Link updated successfully",
      link: updatedLink,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteLink = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req?.user?.id;
  try {
    const linkToDelete = await Link.findOne({ _id, userId });

    // Check if the link exists
    if (!linkToDelete) {
      return res.send({
        success: false,
        message: "Link not found or does not belong to the user.",
      });
    }

    await Link.findByIdAndDelete(_id);

    await Link.updateMany(
      { userId, order: { $gt: linkToDelete.order } },
      { $inc: { order: -1 } }
    );

    res
      .status(200)
      .send({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    res.send({
      success: false,
      message: "Error deleting link",
      error: error.message,
    });
  }
};
