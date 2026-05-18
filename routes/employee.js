const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee");
const authentication = require("../middleware/auth");

// All employee routes are protected
router.get("/", authentication, getAllEmployees);
router.get("/:id", authentication, getEmployeeById);
router.post("/", authentication, createEmployee);
router.put("/:id", authentication, updateEmployee);
router.delete("/:id", authentication, deleteEmployee);

module.exports = router;
