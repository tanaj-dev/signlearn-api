import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "2h";

type JwtPayload = {
  sub: number;
  email: string;
  rol: "aprendiz" | "tutor";
  iat?: number;
  exp?: number;
};

app.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS server_time;");
    return res.json({ status: "ok", db: rows });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "DB connection failed" });
  }
});

app.post("/register", async (req, res) => {
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
      message: "nombre, apellido, email y password son obligatorios",
    });
  }

  if (safeNombre.length > 100 || safeApellido.length > 100) {
    return res.status(400).json({
      message: "nombre y apellido no deben superar 100 caracteres",
    });
  }

  if (!EMAIL_REGEX.test(safeEmail)) {
    return res.status(400).json({ message: "email inválido" });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    });
  }

  try {
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [safeEmail],
    );

    const existingRows = existingUsers as Array<{ id: number }>;
    if (existingRows.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [insertResult] = await pool.query(
      "INSERT INTO users (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)",
      [safeNombre, safeApellido, safeEmail, passwordHash],
    );

    const result = insertResult as { insertId: number };
    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: result.insertId,
        nombre: safeNombre,
        apellido: safeApellido,
        email: safeEmail,
        rol: "aprendiz",
        estado: "activo",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  const safeEmail = email?.trim().toLowerCase();
  if (!safeEmail || !password) {
    return res
      .status(400)
      .json({ message: "email y password son obligatorios" });
  }

  if (!EMAIL_REGEX.test(safeEmail)) {
    return res.status(400).json({ message: "email inválido" });
  }

  try {
    const [userRows] = await pool.query(
      "SELECT id, nombre, apellido, email, password_hash, rol, estado FROM users WHERE email = ? LIMIT 1",
      [safeEmail],
    );

    const users = userRows as Array<{
      id: number;
      nombre: string;
      apellido: string;
      email: string;
      password_hash: string;
      rol: "aprendiz" | "tutor";
      estado: "activo" | "inactivo";
    }>;

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (user.estado !== "activo") {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Falta configurar JWT_SECRET" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        rol: user.rol,
      },
      secret,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Falta configurar JWT_SECRET" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const userId = Number(decoded.sub);
    if (!userId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const [userRows] = await pool.query(
      "SELECT id, nombre, apellido, email, rol, estado, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    const users = userRows as Array<{
      id: number;
      nombre: string;
      apellido: string;
      email: string;
      rol: "aprendiz" | "tutor";
      estado: "activo" | "inactivo";
      created_at: string;
      updated_at: string;
    }>;

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = users[0];
    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user,
    });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
