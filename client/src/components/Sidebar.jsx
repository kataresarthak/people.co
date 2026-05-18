import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiGrid, FiUsers, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="dot"></span>
        <span>PEOPLE.CO</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          end
        >
          <FiGrid className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FiUsers className="nav-icon" />
          <span>Employees</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar-sm">
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "A"}
          </div>
          <div className="user-info">
            <div className="name">{user?.name || "Admin"}</div>
            <div className="email">{user?.email || "admin@peopleco.com"}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Log out">
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
