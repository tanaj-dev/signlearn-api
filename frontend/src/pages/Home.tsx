function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
        <div className="w-full max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            API de Usuarios
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Autenticación de usuarios
            <span className="block text-indigo-600">con React y JWT</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Aplicación frontend desarrollada para consumir una API REST de
            usuarios, permitiendo registrar cuentas, iniciar sesión y
            consultar el perfil del usuario autenticado mediante
            autenticación con JWT.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Crear una cuenta
            </button>

            <button
              type="button"
              className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
            >
              Iniciar sesión
            </button>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">Registro</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Creación de nuevos usuarios mediante la API.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Autenticación
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Inicio de sesión utilizando correo y contraseña.
              </p>
            </div>

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