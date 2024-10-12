const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platformController");

router.get("/", platformController.getplatforms);

module.exports = router;
