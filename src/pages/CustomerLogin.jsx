import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const navigate = useNavigate();

  // ---------------- LOGIN / REGISTER ----------------
  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ---------- LOGIN ----------
      const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (loginRes.data.token) {
        localStorage.setItem("token", loginRes.data.token);

        // ✅ Redirect to product if user clicked one before login
        const redirectProductId = localStorage.getItem("redirectAfterLogin");
        if (redirectProductId) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(`/add-to-cart/${redirectProductId}`);
          return;
        }

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/homepage"), 1000);
        return;
      }
    } catch (err) {
      console.warn("Login failed, trying registration...");
    }

    try {
      // ---------- AUTO-REGISTER ----------
      const registerRes = await axios.post("http://localhost:8080/api/auth/register", {
        email,
        password,
        fullName: email.split("@")[0],
      });

      if (registerRes.data) {
        setMessage("Account created! Logging you in...");

        const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
          email,
          password,
        });

        if (loginRes.data.token) {
          localStorage.setItem("token", loginRes.data.token);

          // ✅ Handle redirect after register too
          const redirectProductId = localStorage.getItem("redirectAfterLogin");
          if (redirectProductId) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(`/add-to-cart/${redirectProductId}`);
            return;
          }

          setTimeout(() => navigate("/homepage"), 1000);
        }
      }
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: resetEmail,
      });
      setMessage(res.data.message || res.data.error);
      setShowForgotModal(false);
    } catch (err) {
      setMessage("Error sending reset link.");
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/reset-password", {
        token: tokenParam,
        newPassword,
      });
      setMessage(res.data.message || res.data.error);
      if (res.data.message) {
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setMessage("Error resetting password.");
    }
  };

  // ---------------- RESET PASSWORD PAGE ----------------
  if (tokenParam) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-5 shadow" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Reset Password
            </button>
          </form>
          {message && <div className="alert alert-info text-center mt-3">{message}</div>}
        </div>
      </div>
    );
  }

  // ---------------- LOGIN PAGE ----------------
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-5 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Customer Login</h2>
        <form onSubmit={handleLoginOrRegister}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Login / Register
          </button>
        </form>

        <p
          className="text-center mt-3 text-primary"
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setShowForgotModal(true)}
        >
          Forgot Password?
        </p>

        {message && <div className="alert alert-info text-center mt-3">{message}</div>}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showForgotModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-3">
                    <label className="form-label">Enter your email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-dark w-100">
                    Send Reset Link
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerLogin;