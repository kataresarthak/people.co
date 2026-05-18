const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const employeeRoutes = require("./routes/employee");
const dashboardRoutes = require("./routes/dashboard");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);

connectDB();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
