import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Import styles

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const createUser = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post("http://localhost:5000/api/Signup", {
        Email: email, // Capitalized to match backend
        Username: username,
        Password: password,
      });
      
    

      if (response.status === 201) {
        setMessage({ text: "Account Created Successfully! Redirecting...", type: "success" });

        // Store login status in localStorage
     

        // Redirect to login page after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage({ text: response.data.message, type: "error" });
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setMessage({
        text: error.response?.data?.message || "Failed to create an account. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="signup-page">
      <header className="header">
        <div className="logo">
          <span className="logo-text">Merchant</span>
          <span className="highlighted-text">Mind</span>
        </div>
      </header>

      <div className="form-container">
        <div className="form-box">
          <h2>Create Account</h2>
          <form onSubmit={createUser}>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Choose a username" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Create a password" 
                required 
              />
            </div>

            {/* Success/Error Messages */}
            {message.text && (
              <p className={message.type === "success" ? "success-message" : "error-message"}>
                {message.text}
              </p>
            )}

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
