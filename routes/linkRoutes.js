const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:id", linkController.createLink);
router.get("/:id", linkController.getLinks);
router.put("/:id", linkController.updateLink);
router.delete("/:id", linkController.deleteLink);

module.exports = router;
