import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 
        Header:
        Es la parte superior de toda la aplicación.
        Contiene el menú de navegación y permanece visible
        independientemente de la página que estemos visitando.
      */}
      <Header />

      {/*
        Routes:
        Aquí definimos qué página debe mostrarse dependiendo
        de la URL que visite el usuario.
      */}
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Página de registro */}
        <Route path="/register" element={<Register />} />

        {/* Página de inicio de sesión */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/*
        Footer:
        Es la parte inferior general de la aplicación.
        También permanece presente en las diferentes páginas.
      */}
      <Footer />
    </div>
  );
}

export default App;