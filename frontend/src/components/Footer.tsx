import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-indigo-800 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
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

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>

          <nav className="flex flex-col gap-3 text-sm">
            <Link to="/" className="transition-colors hover:text-white">
              Inicio
            </Link>

            <Link to="/register" className="transition-colors hover:text-white">
              Registro
            </Link>

            <Link to="/login" className="transition-colors hover:text-white">
              Login
            </Link>
          </nav>
        </div>

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

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© 2026. Todos los derechos reservados.</p>

          <p>SENA · ADSO · Ficha 3235870</p>
        </div>
      </div>
    </footer>
  );
}
