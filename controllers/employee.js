const Employee = require("../model/employee");

// Get all employees with search, filter, and pagination
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      search,
      role,
      team,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search by name, email, or username
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      const roles = role.split(",");
      filter.role = { $in: roles };
    }

    // Filter by team
    if (team) {
      const teams = team.split(",");
      filter.teams = { $in: teams };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      employees,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  const { name, username, email, role, status, teams, dateOfBirth, gender, nationality, contactNo, workEmail } = req.body;

  if (!name || !username || !email || !role) {
    return res.status(400).json({ message: "Name, username, email, and role are required" });
  }

  try {
    // Check for duplicate email or username
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { username }],
    });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email or username already exists" });
    }

    const employee = await Employee.create({
      name,
      username,
      email,
      role,
      status: status || "Active",
      teams: teams || [],
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      nationality: nationality || "",
      contactNo: contactNo || "",
      workEmail: workEmail || "",
    });

    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check for duplicate email or username (excluding current employee)
    if (req.body.email || req.body.username) {
      const duplicateCheck = await Employee.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(req.body.email ? [{ email: req.body.email }] : []),
          ...(req.body.username ? [{ username: req.body.username }] : []),
        ],
      });
      if (duplicateCheck) {
        return res.status(400).json({ message: "Employee with this email or username already exists" });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};
