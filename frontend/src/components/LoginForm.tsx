// LoginForm.tsx
//
// Este componente contiene el formulario de inicio de sesión.
//
// Su responsabilidad es:
// 1. Mostrar los campos del formulario.
// 2. Mantener los datos introducidos por el usuario.
// 3. Detectar los cambios realizados en cada campo.
// 4. Enviar los datos al servicio loginUser() de api.ts.
// 5. Mostrar al usuario si el inicio de sesión fue exitoso o si ocurrió un error.

import { useState } from "react";
import { loginUser } from "../services/api";

// Definimos la estructura de los datos que manejará el formulario.
//
// Estos son exactamente los datos que necesitamos enviar
// al endpoint POST /login del backend.
interface LoginFormData {
  email: string;
  password: string;
}

// Componente principal del formulario de Login.
export default function LoginForm() {
  /*
    Estado del formulario.

    Inicialmente los campos están vacíos.

    formData contiene actualmente los valores escritos
    por el usuario en el formulario.
  */
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  /*
    Estado para mostrar mensajes al usuario.

    Puede contener, por ejemplo:

    "Inicio de sesión exitoso"

    o

    "Credenciales inválidas"
  */
  const [message, setMessage] = useState("");

  /*
    Estado que indica si el mensaje corresponde a un error.

    true  → mostramos un mensaje de error.
    false → mostramos un mensaje de éxito.
  */
  const [isError, setIsError] = useState(false);

  /*
    Estado que nos permite controlar el botón mientras
    estamos esperando la respuesta del backend.

    Mientras loading sea true, evitamos que el usuario
    envíe varias veces el mismo formulario.
  */
  const [loading, setLoading] = useState(false);

  /*
    handleChange se ejecuta cada vez que el usuario
    modifica alguno de los campos.

    Por ejemplo:

    email:
      ""
      ↓
      "p"
      ↓
      "pe"
      ↓
      "pet..."

    Lo mismo ocurre con password.
  */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Obtenemos el nombre del campo y el valor actual.
    //
    // name puede ser "email" o "password".
    // value contiene lo que el usuario acaba de escribir.
    const { name, value } = event.target;

    /*
      Actualizamos solamente el campo que cambió.

      ...previousData conserva los demás valores.

      [name]: value permite utilizar dinámicamente
      el nombre del input.
    */
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    /*
      Si el usuario estaba viendo un mensaje anterior
      y vuelve a escribir, limpiamos ese mensaje.
    */
    setMessage("");
  }

  /*
    handleSubmit se ejecuta cuando el usuario pulsa
    el botón "Iniciar sesión".

    Aquí ocurre la conexión entre:

    formulario
       ↓
    loginUser()
       ↓
    api.ts
       ↓
    POST /login
       ↓
    backend
  */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    // Evitamos que el navegador recargue la página.
    event.preventDefault();

    // Limpiamos cualquier mensaje anterior.
    setMessage("");

    // Indicamos que estamos esperando la respuesta del backend.
    setLoading(true);

    try {
      /*
        Enviamos los datos del formulario al servicio de API.

        loginUser() está definido en:

        frontend/src/services/api.ts

        Ese servicio se encarga de realizar la petición
        POST /login.
      */
      const response = await loginUser(formData);

      /*
        Si el backend responde con un código 200,
        significa que el inicio de sesión fue exitoso.
      */
      if (response.status === 200) {
        setIsError(false);

        /*
          Mostramos al usuario el mensaje enviado
          por nuestro backend.

          Si por alguna razón no viene el mensaje,
          utilizamos uno predeterminado.
        */
        setMessage(
          response.data.message ||
            "Inicio de sesión exitoso.",
        );

        /*
          Por ahora no guardamos todavía el JWT ni
          redirigimos al usuario.

          Primero queremos comprobar que el flujo
          Login → API → Backend funciona correctamente.

          Esa parte la podemos implementar después.
        */
      } else {
        /*
          Cualquier respuesta diferente de 200
          la tratamos como un error.
        */
        setIsError(true);

        /*
          El backend puede devolver mensajes como:

          "Credenciales inválidas"
          "Usuario inactivo"
          "email inválido"

          Mostramos directamente ese mensaje al usuario.
        */
        setMessage(
          response.data.message ||
            "No fue posible iniciar sesión.",
        );
      }
    } catch (error) {
      /*
        Este bloque se ejecuta cuando ni siquiera podemos
        completar la petición.

        Por ejemplo:

        - El backend está apagado.
        - El puerto es incorrecto.
        - Existe un problema de conexión.
        - Existe un problema de CORS.
      */
      console.error("Error al iniciar sesión:", error);

      setIsError(true);

      setMessage(
        "No fue posible conectar con el servidor. Inténtalo nuevamente.",
      );
    } finally {
      /*
        finally se ejecuta tanto si la petición tuvo éxito
        como si terminó en error.

        Por eso aquí podemos indicar que la petición
        terminó y volver a habilitar el botón.
      */
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg sm:p-10">

        {/* Encabezado del formulario */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ingresa tus datos para acceder a tu cuenta.
          </p>
        </div>

        {/* 
          Mensaje de retroalimentación.

          Solamente aparece cuando message tiene contenido.
        */}
        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/*
          Formulario principal.

          onSubmit conecta el formulario con handleSubmit().
        */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Campo de correo electrónico */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* 
            Botón que envía el formulario.

            Mientras loading sea true:

            - El botón queda deshabilitado.
            - Cambiamos el texto para indicar que estamos
              esperando la respuesta.
          */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </section>
  );
}