const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Password minimum length validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existemail = await User.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashpassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const existemail = await User.findOne({ email });
    if (!existemail) return res.status(400).json({ message: "Invalid email" });

    const compare = await bcrypt.compare(password, existemail.password);
    if (!compare) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: existemail._id, name: existemail.name, email: existemail.email },
      process.env.JWT_SECRET || "123456",
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: existemail._id,
        name: existemail.name,
        email: existemail.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    res.status(200).json({ message: "Token is valid", user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
