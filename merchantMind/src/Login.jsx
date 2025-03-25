import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, prevent access to the login page
    if (localStorage.getItem("isAuthenticated")) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const userLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        loginUsername,
        loginPassword,
      });

      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");
        setErrorMessage("");

        // Store user session
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", response.data.username);

        // Modify history state so back button doesn't go to login
        setTimeout(() => {
          navigate("/dashboard", { replace: true }); // Replace history entry
        }, 1500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(error.response?.data?.message || "Invalid username or password.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="logo">
          <span className="logo-text">Merchant</span>
          <span className="highlighted-text">Mind</span>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <div className="login-left">
            <h2>Sign In</h2>
            <form onSubmit={userLogin}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <div className="actions">
                <button type="submit" className="sign-in-button">
                  Sign In
                </button>
                <div className="extras">
                  <label>
                    <input type="checkbox" /> Remember Me
                  </label>
                  <a href="#">Forgot Password?</a>
                </div>
              </div>
            </form>
          </div>

          <div className="login-right">
            <h2>Welcome!</h2>
            <p>Don't have an account?</p>
            <button className="sign-up-button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
