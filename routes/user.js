const express = require("express");
const router = express.Router();
const { register, login, verifyToken, logout } = require("../controllers/user");
const authentication = require("../middleware/auth");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authentication, logout);

router.get("/verify", authentication, verifyToken);

module.exports = router;
