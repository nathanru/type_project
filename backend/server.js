const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER || 'gouser',
  password: process.env.DB_PASSWORD || 'Bogey2012!',
  database: process.env.DB_NAME || 'userdb',
  connectionLimit: 10
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.ip}${req.method} ${req.url}`);
    next();
});

// Serve static files from the 'public' directory
const pubDir = "/home/pi/projects/ts_project/frontend/public";
app.use(express.static(pubDir));
/*
app.use(express.static(path.join(__dirname, pubDir)));
*/
// Route handler for POST requests to '/submit'
app.post('/submit-user-data', (req, res) => {
  // Extract data from request body
  const { firstname, lastname, age } = req.body;

  // Create a MySQL query
  const query = 'INSERT INTO user (first_name, last_name, age) VALUES (?, ?, ?)';

  // Execute the query
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    connection.query(query, [firstname, lastname, age], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      console.log('Inserted into database:', result);
      res.json({ message: 'Form submitted successfully' });
    });
  });
});

// Route handler for POST requests to '/submit-2'
app.post('/submit-address-data', (req, res) => {
  // Extract data from request body
  const { address, city, state, country } = req.body;

  // Create a MySQL query
  const query = 'INSERT INTO cities (address, city, state, country) VALUES (?, ?, ?, ?)';

  // Execute the query
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    connection.query(query, [address, city, state, country], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      console.log('Inserted into database:', result);
      res.json({ message: 'Form submitted successfully' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
