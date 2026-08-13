import { Link } from "react-router-dom";

/**
 * Página principal de la aplicación.
 *
 * Esta página presenta brevemente el objetivo de la aplicación
 * y proporciona accesos directos hacia:
 *
 * - Registro de usuarios.
 * - Inicio de sesión.
 *
 * La navegación se realiza mediante <Link> de React Router,
 * por lo que no es necesario recargar la página.
 */
function Home() {
  return (
    // Contenedor principal de la página.
    <main className="flex-1 bg-slate-50">
      {/* 
        Sección principal:
        - Centra el contenido vertical y horizontalmente.
        - Mantiene una altura mínima para ocupar el espacio disponible.
        - Usa diferentes espacios laterales según el tamaño de pantalla.
      */}
      <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
        {/* Contenedor del contenido central */}
        <div className="w-full max-w-3xl text-center">
          {/* Identificador visual de la aplicación */}
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            API de Usuarios
          </span>

          {/* Título principal */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Autenticación de usuarios
            <span className="block text-indigo-600">
              con React y JWT
            </span>
          </h1>

          {/* Descripción general de la aplicación */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Aplicación frontend desarrollada para consumir una API REST de
            usuarios, permitiendo registrar cuentas, iniciar sesión y consultar
            el perfil del usuario autenticado mediante autenticación con JWT.
          </p>

          {/*
            Botones principales de navegación.

            Importante:
            <Link> reemplaza completamente al antiguo <button>.
            De esta manera todo el elemento funciona como enlace y React Router
            se encarga de navegar hacia la ruta correspondiente.

            cursor-pointer:
            Hace que aparezca la "manito" del cursor al pasar sobre los enlaces,
            dejando claro visualmente que son elementos interactivos.
          */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Enlace hacia la página de registro */}
            <Link
              to="/register"
              className="w-full cursor-pointer rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Crear una cuenta
            </Link>

            {/* Enlace hacia la página de inicio de sesión */}
            <Link
              to="/login"
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
            >
              Iniciar sesión
            </Link>
          </div>

          {/*
            Tarjetas informativas.

            Estas tarjetas no realizan ninguna acción.
            Su función es explicar las tres capacidades principales
            que demuestra esta aplicación para la evidencia.
          */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {/* Tarjeta: Registro */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Registro
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Creación de nuevos usuarios mediante la API.
              </p>
            </div>

            {/* Tarjeta: Autenticación */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Autenticación
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Inicio de sesión utilizando correo y contraseña.
              </p>
            </div>

            {/* Tarjeta: Perfil protegido */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Perfil protegido
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Consulta del usuario autenticado mediante JWT.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;