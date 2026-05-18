const Employee = require("../model/employee");

exports.getDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const inactiveEmployees = await Employee.countDocuments({ status: "Inactive" });

    // Get team-wise breakdown
    const teamStats = await Employee.aggregate([
      { $unwind: "$teams" },
      { $group: { _id: "$teams", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get role-wise breakdown
    const roleStats = await Employee.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get recently added employees
    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role status avatar username");

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      teamStats,
      roleStats,
      recentEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};
