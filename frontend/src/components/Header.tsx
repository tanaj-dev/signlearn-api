import { Link } from 'react-router-dom';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Registro', href: '/register' },
  { label: 'Login', href: '/login' },
];

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-indigo-700 text-slate-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-bold tracking-tight text-slate-300"
        >
          SignLearn
        </Link>

        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-8">
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