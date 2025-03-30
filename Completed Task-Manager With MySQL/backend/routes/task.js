const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../conn/conn"); // MySQL connection
const { authenticateToken } = require("./auth");

// Create Task
router.post("/create-task", authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.headers;  // Get user ID from the token

    // Insert the task into the database, associating it with the user_id
    const query = 'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, description, id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating task" });
      }

      res.status(200).json({ message: "Task Created" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

// Get All Tasks
router.get("/get-all-tasks", authenticateToken, (req, res) => {
  try {
    const { id } = req.headers;  // Get user ID from the token

    // Query to get all tasks for a user
    const query = `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving tasks" });
      }

      console.log(results);  // Log the tasks to verify data
      res.status(200).json({ data: results });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});


// Delete Task
// Delete Task
router.delete("/delete-task/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;  // Task ID to delete
    const userId = req.headers.id;  // Get user ID from the token

    // Delete the task from the tasks table
    const deleteQuery = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.query(deleteQuery, [id, userId], (err, results) => {
      if (err) {
        console.log("Error in DELETE:", err);  // Enhanced logging
        return res.status(500).json({ message: "Error deleting task" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found or does not belong to this user" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    });
  } catch (error) {
    console.log("Error in DELETE route:", error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});


// Update Task
router.put("/update-task/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;  // Task ID from URL
    const { title, description } = req.body;  // New title and description from the request body
    const userId = req.headers.id;  // User ID from the token header

    if (!id) {
      return res.status(400).json({ message: "Task ID is missing. Please try again." });
    }

    // Check if the task exists and belongs to the user
    const getTaskQuery = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
    db.query(getTaskQuery, [id, userId], (err, results) => {
      if (err) {
        console.log("Error in GET Task:", err);
        return res.status(500).json({ message: "Error retrieving task" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Task not found or does not belong to this user" });
      }

      // Update the task
      const updateQuery = 'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?';
      db.query(updateQuery, [title, description, id, userId], (err, results) => {
        if (err) {
          console.log("Error in UPDATE Task:", err);
          return res.status(500).json({ message: "Error updating task" });
        }

        res.status(200).json({ message: "Task updated successfully" });
      });
    });
  } catch (error) {
    console.log("Error in PUT request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});






// Update Important Task
router.put("/update-imp-task/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get the current value of 'important'
    const getTaskQuery = 'SELECT important FROM tasks WHERE id = ? AND user_id = ?';
    db.query(getTaskQuery, [id, req.headers.id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving task" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Task not found or does not belong to this user" });
      }

      const important = results[0].important;

      // Toggle the 'important' value
      const updateQuery = 'UPDATE tasks SET important = ? WHERE id = ?';
      db.query(updateQuery, [!important, id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error updating task importance" });
        }

        res.status(200).json({ message: "Task importance updated successfully" });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

// Update Completed Task
router.put("/update-complete-task/:id", authenticateToken, (req, res) => {
  try {
    const taskId = req.params.id; // Task ID from the URL
    const userId = req.headers.id; // User ID from the request headers

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is missing." });
    }

    // Query to find the task by its ID and ensure it belongs to the logged-in user
    const query = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
    db.query(query, [taskId, userId], (err, results) => {
      if (err) {
        console.log("Error in retrieving task:", err);
        return res.status(500).json({ message: "Error retrieving task." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Task not found or does not belong to this user." });
      }

      // If the task exists, update its completion status
      const updateQuery = "UPDATE tasks SET complete = NOT complete WHERE id = ?";
      db.query(updateQuery, [taskId], (err) => {
        if (err) {
          console.log("Error in updating task:", err);
          return res.status(500).json({ message: "Error updating task completion." });
        }
        res.status(200).json({ message: "Task completion status updated successfully." });
      });
    });
  } catch (error) {
    console.log("Error in PUT request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


// Get Important Tasks
router.get("/get-imp-tasks", authenticateToken, (req, res) => {
  try {
    const { id } = req.headers;

    // Query to get all important tasks for a user
    const query = `
      SELECT * 
      FROM tasks
      WHERE user_id = ? AND important = true
      ORDER BY created_at DESC
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving tasks" });
      }

      res.status(200).json({ data: results });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

// Get Completed Tasks
router.get("/get-complete-tasks", authenticateToken, (req, res) => {
  try {
    const { id } = req.headers;

    // Query to get all completed tasks for a user
    const query = `
      SELECT * 
      FROM tasks
      WHERE user_id = ? AND complete = true
      ORDER BY created_at DESC
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving tasks" });
      }

      res.status(200).json({ data: results });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

// Get Incompleted Tasks
router.get("/get-incomplete-tasks", authenticateToken, (req, res) => {
  try {
    const { id } = req.headers;

    // Query to get all incomplete tasks for a user
    const query = `
      SELECT * 
      FROM tasks
      WHERE user_id = ? AND complete = false
      ORDER BY created_at DESC
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving tasks" });
      }

      res.status(200).json({ data: results });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

module.exports = router;


