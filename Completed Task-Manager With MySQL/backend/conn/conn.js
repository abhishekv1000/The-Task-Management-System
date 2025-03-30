const mysql = require('mysql');

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: "root",
  password: "1221", // your database password
  database: "task_manage", // your database name
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL DB');
});


// CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   username VARCHAR(50) NOT NULL UNIQUE,
//   email VARCHAR(100) NOT NULL UNIQUE,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// CREATE TABLE tasks (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   important BOOLEAN DEFAULT FALSE,
//   complete BOOLEAN DEFAULT FALSE,
//   user_id INT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );


module.exports = {db}; 