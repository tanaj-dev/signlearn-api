// server.ts
//
// Este archivo es el punto de entrada de nuestra API.
//
// Aquí configuramos:
//
// 1. Express.
// 2. CORS para permitir la comunicación con React.
// 3. Conexión con la base de datos.
// 4. Registro de usuarios.
// 5. Inicio de sesión.
// 6. Generación del JWT.
// 7. Consulta del perfil mediante JWT.
// 8. Inicio del servidor en el puerto 4000.
//
// Flujo general:
//
// React (5173)
//      ↓
// api.ts
//      ↓
// Express (4000)
//      ↓
// server.ts
//      ↓
// MySQL (signlearn_api)

import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import pool from "./db";

// Cargamos las variables definidas en el archivo .env.
dotenv.config();

// Creamos la aplicación de Express.
const app = express();

/*
  CORS permite que nuestro frontend y nuestro backend
  puedan comunicarse aunque utilizan puertos diferentes.

  Frontend:
  http://localhost:5173

  Backend:
  http://localhost:4000

  Como son orígenes diferentes, el navegador necesita
  que el backend autorice explícitamente al frontend.
*/
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

/*
  Permite que Express pueda recibir información
  enviada en formato JSON.

  Por ejemplo, desde React enviamos:

  {
    nombre: "Peter",
    apellido: "Parker",
    email: "peter@signlearn.com",
    password: "peter12345"
  }
*/
app.use(express.json());

/*
  Expresión regular utilizada para validar correos.

  El punto antes de "com" está escapado porque
  queremos representar un punto real.
*/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Longitud mínima que debe tener una contraseña.
const MIN_PASSWORD_LENGTH = 8;

// Cantidad de rondas utilizadas por bcrypt para generar
// el hash de las contraseñas.
const SALT_ROUNDS = 10;

// Tiempo de duración del JWT.
const JWT_EXPIRES_IN = "2h";

/*
  Estructura de los datos que guardaremos dentro del JWT.

  sub:
    Identificador del usuario.

  email:
    Correo del usuario.

  rol:
    Rol que tiene el usuario.

  iat:
    Fecha en la que se creó el token.

  exp:
    Fecha en la que expira el token.
*/
type JwtPayload = {
  sub: number;
  email: string;
  rol: "aprendiz" | "tutor";
  iat?: number;
  exp?: number;
};

/*
  --------------------------------------------------------------------------
  RUTA DE PRUEBA
  --------------------------------------------------------------------------

  GET /

  Sirve para comprobar que:

  1. El backend está funcionando.
  2. El backend puede comunicarse con MySQL.
*/
app.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS server_time;");

    return res.json({
      status: "ok",
      db: rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "error",
      message: "DB connection failed",
    });
  }
});

/*
  --------------------------------------------------------------------------
  REGISTRO DE USUARIOS
  --------------------------------------------------------------------------

  POST /register

  Recibe desde React:

  {
    nombre,
    apellido,
    email,
    password
  }

  Después:

  1. Valida los datos.
  2. Comprueba si el correo ya existe.
  3. Encripta la contraseña.
  4. Guarda el usuario en MySQL.
  5. Devuelve una respuesta al frontend.
*/
app.post("/register", async (req, res) => {
  /*
    Extraemos los datos enviados por el frontend.

    El "?" significa que cada propiedad puede no existir.
  */
  const { nombre, apellido, email, password } = req.body as {
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
  };

  /*
    Limpiamos los datos recibidos.

    trim():
      elimina espacios al principio y al final.

    toLowerCase():
      convierte el correo a minúsculas.
  */
  const safeNombre = nombre?.trim();
  const safeApellido = apellido?.trim();
  const safeEmail = email?.trim().toLowerCase();

  /*
    Comprobamos que todos los campos obligatorios
    hayan sido enviados.
  */
  if (!safeNombre || !safeApellido || !safeEmail || !password) {
    return res.status(400).json({
      message: "nombre, apellido, email y password son obligatorios",
    });
  }

  /*
    Validamos la longitud del nombre y apellido.
  */
  if (safeNombre.length > 100 || safeApellido.length > 100) {
    return res.status(400).json({
      message: "nombre y apellido no deben superar 100 caracteres",
    });
  }

  /*
    Validamos el formato del correo.
  */
  if (!EMAIL_REGEX.test(safeEmail)) {
    return res.status(400).json({
      message: "email inválido",
    });
  }

  /*
    Validamos la longitud mínima de la contraseña.
  */
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    });
  }

  try {
    /*
      Primero buscamos si ya existe un usuario
      con ese correo.
    */
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [safeEmail],
    );

    /*
      Convertimos el resultado de MySQL al tipo que
      necesitamos utilizar.
    */
    const existingRows = existingUsers as Array<{
      id: number;
    }>;

    /*
      Si encontramos un usuario, no permitimos
      registrar nuevamente ese correo.
    */
    if (existingRows.length > 0) {
      return res.status(409).json({
        message: "El email ya está registrado",
      });
    }

    /*
      La contraseña nunca se guarda directamente.

      bcrypt genera un hash seguro que es el que
      finalmente almacenamos en MySQL.
    */
    const passwordHash = await bcrypt.hash(
      password,
      SALT_ROUNDS,
    );

    /*
      Insertamos el nuevo usuario.

      El rol y el estado tienen valores predeterminados
      definidos por nuestra base de datos.
    */
    const [insertResult] = await pool.query(
      "INSERT INTO users (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)",
      [
        safeNombre,
        safeApellido,
        safeEmail,
        passwordHash,
      ],
    );

    /*
      Obtenemos el ID generado por MySQL.
    */
    const result = insertResult as {
      insertId: number;
    };

    /*
      Respondemos al frontend indicando que el registro
      fue exitoso.
    */
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

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

/*
  --------------------------------------------------------------------------
  LOGIN
  --------------------------------------------------------------------------

  POST /login

  Recibe:

  {
    email,
    password
  }

  Después:

  1. Busca el usuario.
  2. Comprueba la contraseña.
  3. Comprueba que esté activo.
  4. Genera un JWT.
  5. Devuelve el token y los datos básicos del usuario.
*/
app.post("/login", async (req, res) => {
  /*
    Extraemos las credenciales enviadas por React.
  */
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  /*
    Normalizamos el correo.
  */
  const safeEmail = email?.trim().toLowerCase();

  /*
    Comprobamos que ambos datos existan.
  */
  if (!safeEmail || !password) {
    return res.status(400).json({
      message: "email y password son obligatorios",
    });
  }

  /*
    Comprobamos que el correo tenga un formato válido.
  */
  if (!EMAIL_REGEX.test(safeEmail)) {
    return res.status(400).json({
      message: "email inválido",
    });
  }

  try {
    /*
      Buscamos al usuario por correo.

      También recuperamos password_hash porque necesitamos
      comparar la contraseña enviada con el hash almacenado.
    */
    const [userRows] = await pool.query(
      "SELECT id, nombre, apellido, email, password_hash, rol, estado FROM users WHERE email = ? LIMIT 1",
      [safeEmail],
    );

    /*
      Definimos la estructura que esperamos recibir
      desde la tabla users.
    */
    const users = userRows as Array<{
      id: number;
      nombre: string;
      apellido: string;
      email: string;
      password_hash: string;
      rol: "aprendiz" | "tutor";
      estado: "activo" | "inactivo";
    }>;

    /*
      Si no encontramos ningún usuario, devolvemos
      credenciales inválidas.
    */
    if (users.length === 0) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    /*
      Obtenemos el primer usuario encontrado.
    */
    const user = users[0];

    /*
      Comparamos:

      contraseña enviada
            ↓
      bcrypt.compare()
            ↓
      hash almacenado en MySQL
    */
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash,
    );

    /*
      Si las contraseñas no coinciden, rechazamos
      el inicio de sesión.
    */
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    /*
      Comprobamos que la cuenta esté activa.
    */
    if (user.estado !== "activo") {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    /*
      Obtenemos el secreto utilizado para firmar el JWT.

      Este valor debe existir en el archivo .env.
    */
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "Falta configurar JWT_SECRET",
      });
    }

    /*
      Generamos el JWT.

      Dentro del token guardamos solamente información
      necesaria para identificar al usuario.

      El token tendrá una duración de 2 horas.
    */
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        rol: user.rol,
      },
      secret,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    /*
      Enviamos al frontend:

      - mensaje
      - token JWT
      - información básica del usuario
    */
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

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

/*
  --------------------------------------------------------------------------
  PERFIL DEL USUARIO AUTENTICADO
  --------------------------------------------------------------------------

  GET /me

  Esta ruta necesita recibir un JWT.

  El frontend debe enviarlo mediante:

  Authorization: Bearer <token>

  El backend:

  1. Extrae el token.
  2. Comprueba el JWT.
  3. Obtiene el ID del usuario.
  4. Busca al usuario en MySQL.
  5. Devuelve su información.
*/
app.get("/me", async (req, res) => {
  /*
    Obtenemos la cabecera Authorization.
  */
  const authHeader = req.headers.authorization;

  /*
    Comprobamos que exista y que tenga el formato:

    Bearer TOKEN
  */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token no proporcionado",
    });
  }

  /*
    Eliminamos "Bearer " y conservamos solamente
    el JWT.
  */
  const token = authHeader
    .slice("Bearer ".length)
    .trim();

  /*
    Obtenemos el secreto utilizado para verificar
    el JWT.
  */
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Falta configurar JWT_SECRET",
    });
  }

  try {
    /*
      jwt.verify() devuelve un resultado que puede ser
      un objeto de payload o un string.

      Por eso primero guardamos el resultado sin forzar
      directamente nuestro tipo personalizado.
    */
    const verifiedToken = jwt.verify(token, secret);

    /*
      Un JWT válido para nuestra aplicación debe devolver
      un objeto.

      Si devuelve un string, no tiene la estructura que
      necesitamos.
    */
    if (typeof verifiedToken === "string") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    /*
      Ahora comprobamos que existan las propiedades
      necesarias para nuestro JWT.

      No basta con que el token sea válido criptográficamente;
      también necesitamos que contenga el identificador
      del usuario.
    */
    if (
      typeof verifiedToken.sub !== "number" &&
      typeof verifiedToken.sub !== "string"
    ) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    /*
      Convertimos el identificador del usuario a número.

      Nuestro JWT contiene el ID en "sub".
    */
    const userId = Number(verifiedToken.sub);

    /*
      Comprobamos que realmente tengamos un ID válido.
    */
    if (!userId) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    /*
      Buscamos nuevamente al usuario en MySQL.

      Esto permite obtener información actualizada
      directamente desde la base de datos.
    */
    const [userRows] = await pool.query(
      "SELECT id, nombre, apellido, email, rol, estado, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    /*
      Definimos la estructura de los datos recibidos.
    */
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

    /*
      Si el usuario ya no existe en la base de datos,
      devolvemos un error 404.
    */
    if (users.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    /*
      Obtenemos el usuario encontrado.
    */
    const user = users[0];

    /*
      Devolvemos la información del usuario autenticado.
    */
    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user,
    });
  } catch (err) {
    /*
      Si jwt.verify() falla, normalmente significa que:

      - El token es inválido.
      - El token fue manipulado.
      - El token expiró.
      - El token fue firmado con otro secreto.

      En cualquiera de estos casos rechazamos
      la petición.
    */
    console.error(err);

    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
});

/*
  --------------------------------------------------------------------------
  INICIO DEL SERVIDOR
  --------------------------------------------------------------------------

  Utilizamos PORT del archivo .env si existe.

  Si no existe, utilizamos 4000 como valor predeterminado.
*/
const port = Number(process.env.PORT) || 4000;

/*
  Finalmente ponemos Express a escuchar peticiones.
*/
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});