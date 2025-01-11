const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 100000, // Timeout for connection attempt
});

// Test connection to the database
pool.connect()
  .then(client => {
    console.log("Successfully connected to the database");
    console.log(`Connected to database at: ${client.database}, Host: ${client.host}`);
    client.release(); // Release client after successful connection
  })
  .catch(err => {
    console.error("Error connecting to the database:", err.message);
    console.error("Stack Trace:", err.stack);
  });

module.exports = pool;


