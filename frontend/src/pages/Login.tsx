// Importamos el componente que contiene el formulario de Login.
//
// Login.tsx representa la PÁGINA.
// LoginForm.tsx representa el FORMULARIO que aparecerá dentro de ella.

import LoginForm from "../components/LoginForm";

// Página de inicio de sesión.
//
// Esta función no maneja directamente los datos del formulario.
// Su única responsabilidad es mostrar el componente LoginForm.
export default function Login() {
  return <LoginForm />;
}