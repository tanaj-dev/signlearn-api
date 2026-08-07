import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from './db';

dotenv.config();
const app = express();
app.use(express.json());

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;

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

app.post('/register', async (req, res) => {
  const { nombre, apellido, email, password } = req.body as {
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
  };

  const safeNombre = nombre?.trim();
  const safeApellido = apellido?.trim();
  const safeEmail = email?.trim().toLowerCase();

  if (!safeNombre || !safeApellido || !safeEmail || !password) {
    return res.status(400).json({
      message: 'nombre, apellido, email y password son obligatorios',
    });
  }

  if (safeNombre.length > 100 || safeApellido.length > 100) {
    return res.status(400).json({
      message: 'nombre y apellido no deben superar 100 caracteres',
    });
  }

  if (!EMAIL_REGEX.test(safeEmail)) {
    return res.status(400).json({ message: 'email inválido' });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    });
  }

  try {
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [safeEmail],
    );

    const existingRows = existingUsers as { id: number }[];
    if (existingRows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [insertResult] = await pool.query(
      'INSERT INTO users (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)',
      [safeNombre, safeApellido, safeEmail, passwordHash],
    );

    const result = insertResult as { insertId: number };
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: result.insertId,
        nombre: safeNombre,
        apellido: safeApellido,
        email: safeEmail,
        rol: 'aprendiz',
        estado: 'activo',
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
