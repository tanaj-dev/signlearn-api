


// StrictMode ayuda a detectar posibles problemas durante el desarrollo.
import { StrictMode } from "react";

// createRoot es la forma actual de React para montar la aplicación
// dentro del elemento HTML que tiene el id="root".
import { createRoot } from "react-dom/client";

// Importamos los estilos globales de la aplicación.
import "./index.css";

// Importamos el componente principal de nuestra aplicación.
import App from "./App.tsx";

// BrowserRouter permite que React Router DOM controle
// la navegación entre las diferentes páginas de la aplicación.
import { BrowserRouter } from "react-router-dom";

// Buscamos el elemento <div id="root"></div> que existe en index.html
// y dentro de él renderizamos toda nuestra aplicación.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      BrowserRouter envuelve toda la aplicación.

      Esto permite que App.tsx pueda utilizar:
      - Routes
      - Route
      - Link

      Gracias a esto podemos navegar entre:
      / 
      /register
      /login
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);