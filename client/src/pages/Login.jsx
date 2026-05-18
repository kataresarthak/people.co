import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import Toast from "../components/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters long", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      setToast({ message: "Logged in successfully!", type: "success" });
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Invalid credentials",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="login-card">
        <div className="logo">
          <h2>PEOPLE.CO</h2>
        </div>
        <h3>Welcome back</h3>
        <p className="subtitle">Please enter your details to sign in.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
