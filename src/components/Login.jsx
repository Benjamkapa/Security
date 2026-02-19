import { useState } from "react";
import axios from "axios";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:3001/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLogin(response.data.user);
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B1F3A",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#0B1F3A",
              marginBottom: "16px",
            }}
          >
            <Shield size={36} color="#D4AF37" />
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0B1F3A",
              marginBottom: "8px",
            }}
          >
            SecureGuard Admin
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Sign in to manage your website content
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              color: "#dc2626",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ position: "relative", marginBottom: "24px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "14px",
                paddingRight: "48px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#0B1F3A",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
