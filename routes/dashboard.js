const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboard");
const authentication = require("../middleware/auth");

router.get("/", authentication, getDashboard);

module.exports = router;
