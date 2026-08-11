// Link permite navegar entre las páginas de la aplicación
// sin recargar completamente el navegador.
import { Link } from 'react-router-dom';

// Definimos la estructura que debe tener cada elemento
// del menú de navegación.
type NavItem = {
  label: string;
  href: string;
};

// Lista de enlaces que aparecerán en el Header.
//
// Cada objeto representa una opción del menú.
// El "href" debe coincidir con una ruta existente en App.tsx.
const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Registro', href: '/register' },
  { label: 'Login', href: '/login' },
];

const Header = () => {
  return (
    // Encabezado principal de la aplicación.
    <header className="border-b border-slate-200 bg-indigo-700 text-slate-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/*
          El nombre de la aplicación también funciona como enlace.

          Al hacer clic se navega nuevamente a la página principal:
          /
        */}
        <Link
          to="/"
          className="font-bold tracking-tight text-slate-300"
        >
          SignLearn
        </Link>

        {/* Menú principal de navegación */}
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-8">

            {/*
              Recorremos el arreglo navItems.

              Por cada elemento creamos:
              - un <li>
              - un <Link>

              De esta manera no necesitamos escribir manualmente
              cada enlace del menú.
            */}
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;