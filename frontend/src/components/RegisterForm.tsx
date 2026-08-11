import { useState } from "react";
import { registerUser } from "../services/api";

// Este tipo define la estructura de los datos que maneja el formulario.
interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

// Este tipo define si el mensaje que mostramos al usuario
// corresponde a un éxito o a un error.
type MessageType = "success" | "error" | "";

// Componente encargado de mostrar y controlar el formulario de registro.
export default function RegisterForm() {
  // Estado que contiene los valores actuales de los campos del formulario.
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  // Estado que contiene el mensaje que verá el usuario.
  const [message, setMessage] = useState("");

  // Estado que indica si estamos esperando la respuesta de la API.
  // Mientras sea true, evitamos que el usuario envíe varias veces
  // el mismo formulario.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Indica si el mensaje mostrado corresponde a éxito o error.
  const [messageType, setMessageType] = useState<MessageType>("");

  // Se ejecuta cada vez que el usuario escribe en cualquiera
  // de los campos del formulario.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    // Conservamos los valores anteriores y solamente actualizamos
    // el campo que acaba de modificar el usuario.
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Se ejecuta cuando el usuario pulsa el botón "Registrarse".
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Evitamos que el navegador recargue la página.
    event.preventDefault();

    // Evitamos enviar otra petición mientras la actual está pendiente.
    if (isSubmitting) {
      return;
    }

    // Limpiamos cualquier mensaje anterior.
    setMessage("");
    setMessageType("");

    // Indicamos que estamos enviando los datos.
    setIsSubmitting(true);

    try {
      // Enviamos los datos del formulario a nuestra función de servicio.
      const response = await registerUser(formData);

      // Registro exitoso.
      if (response.status === 201) {
        setMessage("Registro exitoso. Tu cuenta ha sido creada correctamente.");
        setMessageType("success");

        // Limpiamos el formulario para permitir un nuevo registro.
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
        });

        return;
      }

      // El backend informa que el correo ya está registrado.
      if (response.status === 409) {
        setMessage(
          response.data?.message ||
            "Este correo ya está registrado. Intenta con otro.",
        );
        setMessageType("error");

        // No limpiamos el formulario porque el usuario puede
        // cambiar solamente el correo y volver a intentarlo.
        return;
      }

      // Errores relacionados con los datos enviados.
      if (response.status === 400) {
        setMessage(
          response.data?.message ||
            "Los datos enviados no son válidos. Revisa el formulario.",
        );
        setMessageType("error");

        return;
      }

      // Cualquier otro error HTTP que devuelva el backend.
      if (response.status >= 500) {
        setMessage(
          response.data?.message ||
            "Ocurrió un error en el servidor. Inténtalo nuevamente.",
        );
        setMessageType("error");

        return;
      }

      // Respuesta inesperada de la API.
      setMessage(
        response.data?.message || "No fue posible completar el registro.",
      );
      setMessageType("error");
    } catch (error) {
      // Este bloque se ejecuta cuando la petición ni siquiera
      // consigue comunicarse correctamente con el backend.
      console.error("Error al registrar usuario:", error);

      setMessage(
        "No se pudo conectar con el servidor. Verifica que la API esté funcionando.",
      );
      setMessageType("error");
    } finally {
      // Independientemente de si la petición terminó correctamente
      // o con un error, dejamos de indicar que estamos enviando.
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Crear cuenta</h1>

          <p className="mt-2 text-sm text-slate-500">
            Regístrate para comenzar a utilizar la plataforma.
          </p>
        </div>

        {/* 
          Este mensaje solamente aparece después de intentar registrar
          el usuario y le informa qué ocurrió con la operación.
        */}
        {message && (
          <div
            role="alert"
            className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nombre
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Campo Apellido */}
          <div>
            <label
              htmlFor="apellido"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Apellido
            </label>

            <input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Campo Correo electrónico */}
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
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Campo Contraseña */}
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
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </section>
  );
}
