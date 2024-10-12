const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, linkController.createLink);
router.get("/:id", linkController.getLinks);
router.put("/", authMiddleware, linkController.updateLink);
router.delete("/:id", authMiddleware, linkController.deleteLink);

module.exports = router;
