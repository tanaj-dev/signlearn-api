// Link permite navegar entre las diferentes páginas de la aplicación
// utilizando React Router sin recargar completamente el navegador.
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    /*
      Footer principal de la aplicación.

      Contiene tres bloques:
      1. Información de SignLearn.
      2. Enlaces de navegación.
      3. Información de la evidencia y del proyecto.
    */
    <footer className="border-t border-slate-800 bg-indigo-800 text-slate-300">
      
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">

        {/* Información general de SignLearn */}
        <div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
            SignLearn
          </h2>

          <h3 className="max-w-sm text-sm leading-6 text-slate-400">
            Aprende LSC de forma interactiva y divertida -
            SignLearn es tu plataforma para dominar la Lengua de Señas
            Colombiana. Lecciones paso a paso, práctica interactiva y una
            comunidad que te apoya.
          </h3>
        </div>

        {/* Enlaces de navegación */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>

          <nav className="flex flex-col gap-3 text-sm">

            {/* Regresa a la página principal */}
            <Link
              to="/"
              className="transition-colors hover:text-white"
            >
              Inicio
            </Link>

            {/* Lleva a la página de registro */}
            <Link
              to="/register"
              className="transition-colors hover:text-white"
            >
              Registro
            </Link>

            {/* Lleva a la página de Login */}
            <Link
              to="/login"
              className="transition-colors hover:text-white"
            >
              Login
            </Link>

          </nav>
        </div>

        {/* Información relacionada con el proyecto y la evidencia */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Información
          </h3>

          <div className="space-y-2 text-sm text-slate-400">

            <p>
              <span className="text-slate-300">Autor:</span> Alfred Vásquez
            </p>

            <p>
              <span className="text-slate-300">Evidencia:</span>{" "}
              GA7-2206015432-AA5-EV02
            </p>

            <p>
              <span className="text-slate-300">Aplicación:</span> API de
              Usuarios – Autenticación
            </p>

          </div>
        </div>
      </div>

      {/* Parte inferior del Footer */}
      <div className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">

          {/* Copyright */}
          <p>© 2026. Todos los derechos reservados.</p>

          {/* Información académica */}
          <p>SENA · ADSO · Ficha 3235870</p>

        </div>
      </div>
    </footer>
  );
}