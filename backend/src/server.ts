import express from 'express';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    // quick db test
    const [rows] = await pool.query('SELECT NOW() AS server_time;');
    res.json({ status: 'ok', db: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
