// URL base de nuestra API.
// El backend de Express está ejecutándose actualmente en el puerto 4000.
const API_URL = "http://localhost:4000";

// ============================================================
// REGISTRO DE USUARIOS
// ============================================================

// Datos que el formulario de registro envía al backend.
export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

// Envía los datos del formulario al endpoint POST /register.
export async function registerUser(data: RegisterData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",

    // Indicamos al backend que estamos enviando información en formato JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // Convertimos el objeto de JavaScript a JSON antes de enviarlo.
    body: JSON.stringify(data),
  });

  // El backend responde también en formato JSON.
  const result = await response.json();

  // Devolvemos tanto el código HTTP como los datos enviados por el backend.
  // Por ejemplo:
  // 201 -> registro exitoso
  // 409 -> el correo ya existe
  // 400 -> datos inválidos
  // 500 -> error interno del servidor
  return {
    status: response.status,
    data: result,
  };
}

// ============================================================
// LOGIN DE USUARIOS
// ============================================================

// Datos que el formulario de login enviará al backend.
export interface LoginData {
  email: string;
  password: string;
}

// Envía las credenciales al endpoint POST /login.
//
// Si las credenciales son correctas, el backend devuelve:
// - un mensaje de confirmación
// - un token JWT
// - los datos básicos del usuario
//
// El token será importante posteriormente para acceder
// a rutas protegidas como GET /me.
export async function loginUser(data: LoginData) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    // El backend espera recibir JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // Convertimos las credenciales a JSON.
    body: JSON.stringify(data),
  });

  // Convertimos la respuesta del backend de JSON a un objeto JavaScript.
  const result = await response.json();

  // Devolvemos el estado HTTP y la información recibida.
  //
  // Ejemplos:
  // 200 -> login exitoso y recibimos el JWT
  // 400 -> datos incompletos o email inválido
  // 401 -> credenciales inválidas
  // 403 -> usuario inactivo
  // 500 -> error interno del servidor
  return {
    status: response.status,
    data: result,
  };
}