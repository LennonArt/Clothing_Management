import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserAccountPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:8080/api/auth/update-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error || "❌ Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Account ⚙️</h2>
      <form className="mt-4" onSubmit={handlePasswordUpdate}>
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          className="btn btn-outline-dark ms-3"
          onClick={() => navigate("/homepage")}
        >
          Back
        </button>
      </form>

      {message && <p className="mt-3 fw-bold">{message}</p>}
    </div>
  );
}

export default UserAccountPage;