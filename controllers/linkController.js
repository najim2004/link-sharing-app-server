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

// usrl chekcker
function isValidLink(text) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocol (http or https)
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IPv4 address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-zA-Z\\d_]*)?$", // Fragment locator
    "i"
  );

  return urlPattern.test(text);
}

exports.updateLink = async (req, res) => {
  const userId = req?.user?.id;
  const updatedDataArray = req.body;
  let updateFailedIds = [];

  try {
    // Process each link update
    const updateResults = await Promise.all(
      updatedDataArray.map(async (obj) => {
        if (!isValidLink(obj.url)) {
          return { success: false, message: "Invalid URL" };
        }

        const { _id } = obj;
        const link = await Link.findById(_id);

        // Check if link exists
        if (!link) {
          updateFailedIds.push(_id);
          return { success: false, message: `Link not found for "${_id}"` };
        }

        // Check if the link belongs to the current user
        if (link.userId.toString() !== userId) {
          updateFailedIds.push(_id);
          return {
            success: false,
            message: `You are not authorized to update the link with ID "${_id}"`,
          };
        }

        // Update only the changed properties
        Object.keys(obj).forEach((key) => {
          if (link[key] !== obj[key]) {
            link[key] = obj[key];
          }
        });

        // Save the updated link
        const updatedLink = await link.save();

        // Check if the update was successful
        if (!updatedLink) {
          updateFailedIds.push(link._id);
          return {
            success: false,
            message: `Failed to update link with ID "${_id}"`,
          };
        }

        return {
          success: true,
          message: `Link with ID "${_id}" updated successfully`,
        };
      })
    );

    // Check if any updates failed
    if (updateFailedIds.length > 0) {
      return res.send({
        success: false,
        message: "Some updates failed",
        failedIds: updateFailedIds,
      });
    }

    // All updates were successful
    res.send({
      success: true,
      message: "All links updated successfully",
    });
  } catch (error) {
    console.error("Error updating links:", error);
    res.send({
      success: false,
      message: "An error occurred while updating the links",
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
