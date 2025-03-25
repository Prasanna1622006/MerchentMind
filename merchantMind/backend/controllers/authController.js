
import db from "../config/db.js";

// Handle user signup
export const signup = async (req, res) => {
  const { Email, Username, Password } = req.body;

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Check if email is valid
  if (!isValidEmail(Email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format. Please enter a valid email." });
  }

  // Check if password is strong
  if (!isValidPassword(Password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
    });
  }

  try {
    const sql =
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    const values = [Email, Username, Password];

    const [result] = await db.execute(sql, values);
    console.log("User inserted successfully:", result);

    res.status(201).json({ message: "User Added Successfully" });
  } catch (err) {
    console.error("Error inserting data into MySQL:", err);

    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("for key 'users.username'")) {
        return res.status(400).json({ message: "Username already exists" });
      } else if (err.sqlMessage.includes("for key 'users.email'")) {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(400).json({ message: "Duplicate entry" });
    }

    res.status(500).json({ message: "Database error", details: err.message });
  }
};


// Handle user login
export const login = async (req, res) => {
  const { loginUsername, loginPassword } = req.body;

  if (!loginUsername || !loginPassword) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  try {
    // Fetch user from database (case-insensitive username check)
    const sql = "SELECT * FROM users WHERE LOWER(username) = LOWER(?)";
    const [users] = await db.execute(sql, [loginUsername]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid Username" });
    }

    const user = users[0];

    // Validate password
    if (user.password !== loginPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    // Success
    res
      .status(200)
      .json({ message: "Login successful", username: user.username });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Database query failed", details: error.message });
  }
};