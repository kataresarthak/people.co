import React, { useState, useEffect, useRef } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/api";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";

const ROLES = [
  "Product Designer",
  "Product Manager",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Project Manager",
];

const TEAMS = [
  "Design",
  "Product",
  "Marketing",
  "Technology",
  "Finance",
  "HR",
  "Operations",
];

const GENDERS = ["Male", "Female", "Other"];

const Employees = () => {
  // State variables
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Panel & Modal States
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Dropdown States
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    status: "Active",
    teams: [],
    dateOfBirth: "",
    gender: "",
    nationality: "",
    contactNo: "",
    workEmail: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Refs for closing dropdowns outside click
  const roleDropdownRef = useRef();
  const teamDropdownRef = useRef();

  useEffect(() => {
    fetchEmployees();
  }, [page, search, selectedRole, selectedTeam, selectedStatus]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(e.target)) {
        setShowTeamDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        page,
        limit: 10,
        search,
        role: selectedRole,
        team: selectedTeam,
        status: selectedStatus,
      });
      setEmployees(res.data.employees);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to fetch employees",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? "" : status);
    setPage(1);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(selectedRole === role ? "" : role);
    setPage(1);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(selectedTeam === team ? "" : team);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.role) errors.role = "Role is required";

    if (formData.workEmail && !/^\S+@\S+\.\S+$/.test(formData.workEmail)) {
      errors.workEmail = "Invalid work email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Modals
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      username: "",
      email: "",
      role: "",
      status: "Active",
      teams: [],
      dateOfBirth: "",
      gender: "",
      nationality: "",
      contactNo: "",
      workEmail: "",
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (emp, e) => {
    e.stopPropagation();
    setModalMode("edit");
    setFormData({
      id: emp._id,
      name: emp.name,
      username: emp.username,
      email: emp.email,
      role: emp.role,
      status: emp.status || "Active",
      teams: emp.teams || [],
      dateOfBirth: emp.dateOfBirth || "",
      gender: emp.gender || "",
      nationality: emp.nationality || "",
      contactNo: emp.contactNo || "",
      workEmail: emp.workEmail || "",
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (emp, e) => {
    e.stopPropagation();
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // Handle Team Multiselect checkbox
  const handleTeamCheckbox = (team) => {
    const updatedTeams = formData.teams.includes(team)
      ? formData.teams.filter((t) => t !== team)
      : [...formData.teams, team];
    setFormData({ ...formData, teams: updatedTeams });
  };

  // Save Employee (Add or Edit)
  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === "add") {
        await createEmployee(formData);
        setToast({ message: "Employee added successfully!", type: "success" });
      } else {
        await updateEmployee(formData.id, formData);
        setToast({ message: "Employee updated successfully!", type: "success" });
      }
      setIsAddEditModalOpen(false);
      fetchEmployees();
      // If editing currently selected view-only employee details, update the detail view
      if (selectedEmployee && selectedEmployee._id === formData.id) {
        setSelectedEmployee({ ...selectedEmployee, ...formData });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to save employee",
        type: "error",
      });
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployee(selectedEmployee._id);
      setToast({ message: "Employee deleted successfully!", type: "success" });
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to delete employee",
        type: "error",
      });
    }
  };

  // Get Team Badge CSS Class
  const getTeamClass = (team) => {
    switch (team.toLowerCase()) {
      case "design": return "design";
      case "product": return "product";
      case "marketing": return "marketing";
      case "technology": return "technology";
      case "finance": return "finance";
      default: return "";
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="main-content w-100 position-relative">
        {toast && (
          <div className="toast-container">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        <header className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h1>Employees</h1>
            <p>Manage your organization's directory and employee information.</p>
          </div>
          <button className="add-btn" onClick={openAddModal}>
            <FiPlus /> Add Employee
          </button>
        </header>

        {/* Filters and search section */}
        <section className="directory-section">
          <div className="directory-header">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, username or email..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <div className="filter-group">
              {/* Role filter */}
              <div className="filter-dropdown" ref={roleDropdownRef}>
                <button
                  className={`filter-btn ${selectedRole ? "active" : ""}`}
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <FiFilter /> {selectedRole || "Roles"}
                </button>
                {showRoleDropdown && (
                  <div className="filter-dropdown-menu">
                    {ROLES.map((role) => (
                      <label key={role}>
                        <input
                          type="checkbox"
                          checked={selectedRole === role}
                          onChange={() => handleRoleSelect(role)}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Team filter */}
              <div className="filter-dropdown" ref={teamDropdownRef}>
                <button
                  className={`filter-btn ${selectedTeam ? "active" : ""}`}
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                >
                  <FiFilter /> {selectedTeam || "Teams"}
                </button>
                {showTeamDropdown && (
                  <div className="filter-dropdown-menu">
                    {TEAMS.map((team) => (
                      <label key={team}>
                        <input
                          type="checkbox"
                          checked={selectedTeam === team}
                          onChange={() => handleTeamSelect(team)}
                        />
                        {team}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Status filter buttons */}
              <button
                className={`filter-btn ${selectedStatus === "Active" ? "active" : ""}`}
                onClick={() => handleStatusFilter("Active")}
              >
                Active
              </button>
              <button
                className={`filter-btn ${selectedStatus === "Inactive" ? "active" : ""}`}
                onClick={() => handleStatusFilter("Inactive")}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Table section */}
          <div className="emp-table-wrap">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No employees found matching your criteria.
              </div>
            ) : (
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Teams</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp._id}
                      onClick={() => setSelectedEmployee(emp)}
                      className={
                        selectedEmployee?._id === emp._id ? "bg-light" : ""
                      }
                    >
                      <td>
                        <div className="emp-name-cell">
                          <div className="avatar">
                            {emp.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2)}
                          </div>
                          <div className="emp-name-info">
                            <div className="emp-name">{emp.name}</div>
                            <div className="emp-username">@{emp.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${emp.status.toLowerCase()}`}
                        >
                          <span className="dot"></span>
                          {emp.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: "500", color: "var(--text-secondary)" }}>
                        {emp.role}
                      </td>
                      <td>
                        <div className="team-badges">
                          {emp.teams?.map((team) => (
                            <span
                              key={team}
                              className={`team-badge ${getTeamClass(team)}`}
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmployee(emp);
                            }}
                            title="View Profile"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={(e) => openEditModal(emp, e)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={(e) => openDeleteModal(emp, e)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {!loading && employees.length > 0 && (
              <div className="pagination-wrap">
                <div className="pagination-info">
                  Showing Page {page} of {totalPages} ({total} total employees)
                </div>
                <div className="pagination-btns">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      className={`page-btn ${page === idx + 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Details Slider Panel */}
        {selectedEmployee && !isDeleteModalOpen && (
          <aside className="detail-panel">
            <div className="panel-header">
              <h2 className="fs-5 fw-semibold m-0">Employee Details</h2>
              <button
                className="icon-btn"
                onClick={() => setSelectedEmployee(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="panel-body">
              <div className="profile-section">
                <div className="profile-avatar">
                  {selectedEmployee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
                <h3>{selectedEmployee.name}</h3>
                <div className="profile-role">{selectedEmployee.role}</div>
              </div>

              <div className="info-group">
                <h4>Personal Details</h4>
                <div className="info-row">
                  <span className="label">Date of Birth</span>
                  <span className="value">
                    {selectedEmployee.dateOfBirth || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Gender</span>
                  <span className="value">
                    {selectedEmployee.gender || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Nationality</span>
                  <span className="value">
                    {selectedEmployee.nationality || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Contact No.</span>
                  <span className="value">
                    {selectedEmployee.contactNo || "N/A"}
                  </span>
                </div>
              </div>

              <div className="info-group">
                <h4>Work Details</h4>
                <div className="info-row">
                  <span className="label">Work Email</span>
                  <span className="value">
                    {selectedEmployee.workEmail || selectedEmployee.email}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Username</span>
                  <span className="value">@{selectedEmployee.username}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status</span>
                  <span className="value">
                    <span
                      className={`status-badge ${selectedEmployee.status.toLowerCase()}`}
                    >
                      <span className="dot"></span>
                      {selectedEmployee.status}
                    </span>
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Teams</span>
                  <span className="value">
                    <div className="team-badges justify-content-end">
                      {selectedEmployee.teams?.map((team) => (
                        <span
                          key={team}
                          className={`team-badge ${getTeamClass(team)}`}
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  className="btn btn-secondary flex-grow-1"
                  onClick={(e) => openEditModal(selectedEmployee, e)}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-danger"
                  onClick={(e) => openDeleteModal(selectedEmployee, e)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Add/Edit Modal */}
        {isAddEditModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddEditModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalMode === "add" ? "Add New Employee" : "Edit Employee"}</h3>
                <button
                  className="icon-btn"
                  onClick={() => setIsAddEditModalOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSaveEmployee}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name*</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={formErrors.name ? "is-invalid" : ""}
                        required
                      />
                      {formErrors.name && (
                        <div className="text-danger fs-7">{formErrors.name}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Username*</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className={formErrors.username ? "is-invalid" : ""}
                        required
                      />
                      {formErrors.username && (
                        <div className="text-danger fs-7">{formErrors.username}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address*</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={formErrors.email ? "is-invalid" : ""}
                        required
                      />
                      {formErrors.email && (
                        <div className="text-danger fs-7">{formErrors.email}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Role*</label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className={formErrors.role ? "is-invalid" : ""}
                        required
                      >
                        <option value="">Select Role</option>
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {formErrors.role && (
                        <div className="text-danger fs-7">{formErrors.role}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      >
                        <option value="">Select Gender</option>
                        {GENDERS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="text"
                        placeholder="DD-MM-YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Nationality</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) =>
                          setFormData({ ...formData, nationality: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        type="text"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({ ...formData, contactNo: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Work Email</label>
                      <input
                        type="email"
                        value={formData.workEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, workEmail: e.target.value })
                        }
                        className={formErrors.workEmail ? "is-invalid" : ""}
                      />
                      {formErrors.workEmail && (
                        <div className="text-danger fs-7">
                          {formErrors.workEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Assign Teams</label>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {TEAMS.map((team) => {
                        const isChecked = formData.teams.includes(team);
                        return (
                          <button
                            type="button"
                            key={team}
                            onClick={() => handleTeamCheckbox(team)}
                            className={`btn ${
                              isChecked
                                ? "btn-primary"
                                : "btn-light border"
                            }`}
                            style={{
                              fontSize: "12px",
                              padding: "4px 10px",
                              borderRadius: "16px",
                            }}
                          >
                            {team}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsAddEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="delete-modal-body">
                <div className="delete-icon">
                  <FiTrash2 />
                </div>
                <h3>Delete Employee</h3>
                <p>
                  Are you sure you want to delete {selectedEmployee?.name}? This
                  action cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Employees;
