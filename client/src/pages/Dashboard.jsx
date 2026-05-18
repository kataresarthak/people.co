import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiUserCheck, FiUserMinus, FiArrowRight } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getDashboard();
      setStats(res.data);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to load dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="main-content w-100">
        {toast && (
          <div className="toast-container">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        <header className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || "Admin"}! Here's what's happening today.</p>
        </header>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-welcome">
              <div className="welcome-card">
                <h2>Manage your team seamlessly</h2>
                <p>Track statuses, manage organizational units, assign teams, and keep records up-to-date.</p>
              </div>
            </div>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FiUsers />
                </div>
                <div className="stat-value">{stats?.totalEmployees || 0}</div>
                <div className="stat-label">Total Employees</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <FiUserCheck />
                </div>
                <div className="stat-value">{stats?.activeEmployees || 0}</div>
                <div className="stat-label">Active Members</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">
                  <FiUserMinus />
                </div>
                <div className="stat-value">{stats?.inactiveEmployees || 0}</div>
                <div className="stat-label">Inactive Members</div>
              </div>
            </section>

            <div className="container-fluid px-4 mb-5">
              <div className="row g-4">
                {/* Team & Department breakdown */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <h3 className="fs-5 fw-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                      Teams Overview
                    </h3>
                    {stats?.teamStats && stats.teamStats.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {stats.teamStats.map((team, idx) => {
                          const percentage = stats.totalEmployees
                            ? (team.count / stats.totalEmployees) * 100
                            : 0;
                          return (
                            <div key={team._id}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fs-6 fw-medium text-secondary">{team._id}</span>
                                <span className="fs-6 fw-semibold" style={{ color: "var(--primary-dark)" }}>
                                  {team.count} {team.count === 1 ? "member" : "members"}
                                </span>
                              </div>
                              <div className="progress rounded-pill" style={{ height: "8px", background: "var(--bg)" }}>
                                <div
                                  className="progress-bar rounded-pill"
                                  style={{
                                    width: `${percentage}%`,
                                    background: "var(--primary)",
                                  }}
                                  role="progressbar"
                                  aria-valuenow={percentage}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">No team data available</div>
                    )}
                  </div>
                </div>

                {/* Quick Navigation and Recent Activity */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <h3 className="fs-5 fw-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                      Quick Actions
                    </h3>
                    <div className="d-grid gap-3 mb-4">
                      <Link
                        to="/employees"
                        className="btn btn-light d-flex justify-content-between align-items-center py-3 px-4 border text-start rounded-3 hover-shadow-sm"
                        style={{ color: "var(--text-primary)", fontWeight: "500" }}
                      >
                        <span>View Full Employee Directory</span>
                        <FiArrowRight style={{ color: "var(--primary)" }} />
                      </Link>
                    </div>

                    <h3 className="fs-6 fw-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                      Recently Added Employees
                    </h3>
                    {stats?.recentEmployees && stats.recentEmployees.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {stats.recentEmployees.map((emp) => (
                          <div key={emp._id} className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <div className="avatar" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                                {emp.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                              </div>
                              <div>
                                <div className="fw-medium text-dark" style={{ fontSize: "14px" }}>
                                  {emp.name}
                                </div>
                                <div className="text-muted" style={{ fontSize: "12px" }}>
                                  {emp.role}
                                </div>
                              </div>
                            </div>
                            <span className={`status-badge ${emp.status.toLowerCase()}`}>
                              <span className="dot"></span>
                              {emp.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">No recent employees added</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
