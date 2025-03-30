const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../conn/conn"); // Import your MySQL connection

// Sign-In
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      
      if (results.length > 0) {
        const existingUser = results.find(user => user.username === username);
        const existingEmail = results.find(user => user.email === email);

        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }

        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      // Hash the password
      const hashPass = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPass], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error saving user" });
        }

        return res.status(200).json({
          message: "Sign-In successful",
        });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const existingUser = results[0];

    // Compare the password with the hashed password stored in the database
    bcrypt.compare(password, existingUser.password, (err, match) => {
      if (match) {
        const authClaims = [{ name: username }, { jti: jwt.sign({}, "rajTM") }];
        const token = jwt.sign({ authClaims }, "rajTM", { expiresIn: "5d" });

        res.status(200).json({ id: existingUser.id, token: token });
      } else {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    });
  });
});

// Get User Info by ID
router.get("/get-user-info", (req, res) => {
  const userId = req.headers.id; // Get ID from headers

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  db.query('SELECT username, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]); // Send username and email
  });
});

module.exports = router;
