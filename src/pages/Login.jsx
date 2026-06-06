import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "https://student-management-system-4-hose.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        name,
        password,
      });

      if (data.success) {
        const user = data.user;

        // --- REFRESH DATA ON EVERY LOGIN ---
        localStorage.clear(); 
        
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("studentName", user.name);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("session", user.session); 
        localStorage.setItem("joining_date", user.joining_date); 

        if (user.role === "student") {
          localStorage.setItem("studentClass", user.class);
          localStorage.setItem("studentId", user.id);
          
          // --- STREAM ONLY FOR 11th & 12th ---
          const isHigherSecondary = ["11", "12", "11th", "12th"].includes(String(user.class));
          if (isHigherSecondary && user.stream) {
            localStorage.setItem("studentStream", user.stream);
          }
        }

        navigate(user.role === "admin" ? "/admin" : "/student");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server Error: " + (err.response?.data?.message || "Check connection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(15px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes floatSlow {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* --- ANIMATED BACKGROUND BUBBLES --- */}
      <div style={{ ...styles.bubble, ...styles.bubble1 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble2 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble3 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble4 }}></div>

      {/* --- BRANDING (CLASSIO & SCHOOL NAME) --- */}
      <div style={styles.branding}>
        <div style={styles.appBadge}>CLASSIO</div>
        <h1 style={styles.logo}>THE HAPPY VALLEY</h1>
        <h2 style={styles.subLogo}>INTERNATIONAL SCHOOL</h2>
        <p style={styles.tagline}>
          Nurturing Minds | Inspiring Excellence | Shaping Futures
        </p>
      </div>

      {/* --- LOGIN CARD --- */}
      <div style={styles.loginCard}>
        <h2 style={styles.loginTitle}>Portal Login</h2>

        {error && <p style={styles.errorStyle}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputBox}>
            <label style={styles.label}>Username / Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your registered name"
              required
            />
          </div>

          <div style={styles.inputBox}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying Credentials..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ------------------ STYLES --------------------

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fa", 
    position: "relative",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
    padding: "20px 0",
  },
  bubble: {
    position: "absolute",
    borderRadius: "50%",
    zIndex: 0,
    filter: "blur(2px)",
    opacity: 0.4,
  },
  bubble1: {
    width: "120px",
    height: "120px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
    top: "8%",
    left: "12%",
    animation: "floatSlow 9s infinite ease-in-out",
  },
  bubble2: {
    width: "90px",
    height: "90px",
    background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", 
    bottom: "12%",
    right: "12%",
    animation: "float 7s infinite ease-in-out",
  },
  bubble3: {
    width: "150px",
    height: "150px",
    background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)", 
    top: "15%",
    right: "8%",
    animation: "floatSlow 11s infinite ease-in-out",
  },
  bubble4: {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)", 
    bottom: "18%",
    left: "15%",
    animation: "float 8s infinite ease-in-out",
  },
  branding: {
    textAlign: "center",
    color: "#333",
    zIndex: 1,
    marginBottom: "30px",
    animation: "fadeIn 0.8s ease",
    padding: "0 15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  appBadge: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "800",
    padding: "5px 16px",
    borderRadius: "20px",
    letterSpacing: "0.15em",
    marginBottom: "12px",
    boxShadow: "0 4px 10px rgba(30, 58, 138, 0.15)",
    display: "inline-block",
  },
  logo: {
    fontSize: "clamp(28px, 5.5vw, 48px)",
    fontWeight: "900",
    margin: "0",
    letterSpacing: "0.03em",
    color: "#1e3a8a", 
    lineHeight: "1.1",
  },
  subLogo: {
    fontSize: "clamp(16px, 3vw, 24px)",
    fontWeight: "700",
    margin: "4px 0 0 0",
    letterSpacing: "0.12em",
    color: "#b45309", 
  },
  tagline: {
    fontSize: "clamp(11px, 1.8vw, 14px)",
    color: "#64748b",
    fontWeight: "600",
    marginTop: "12px",
    fontStyle: "italic",
  },
  loginCard: {
    width: "90%",
    maxWidth: "350px",
    padding: "30px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(30, 58, 138, 0.06)", 
    zIndex: 2,
    border: "1px solid rgba(255, 255, 255, 0.8)",
    animation: "fadeIn 1s ease",
  },
  loginTitle: {
    marginBottom: "25px",
    fontWeight: "800",
    fontSize: "24px",
    color: "#1e293b",
    borderLeft: "5px solid #1e3a8a", 
    paddingLeft: "12px",
  },
  inputBox: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "700",
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    padding: "10px 0",
    border: "none",
    borderBottom: "2px solid #e2e8f0",
    fontSize: "16px",
    background: "transparent",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(30, 58, 138, 0.2)",
    marginTop: "10px",
    transition: "all 0.2s",
  },
  errorStyle: {
    color: "#ef4444",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #fca5a5",
  },
};

export default Login;