const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Connected to PostgreSQL');
      client.release();
      return;
    } catch (err) {
      console.log(`⏳ DB not ready (attempt ${i}/${retries}): ${err.message}`);
      if (i === retries) {
        console.error('❌ Could not connect to the database. Exiting.');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = { pool, connectWithRetry };