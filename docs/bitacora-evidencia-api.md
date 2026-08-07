# Bitácora - Evidencias API (Sesión 49)

## Datos generales

- Proyecto: SignLearn (simulación inicial)
- Evidencia 1: Creación de API para autenticación de usuarios
- Evidencia 2: Testing de API con Postman + video
- Stack acordado:
  - Backend: Node.js + Express + TypeScript + MySQL
  - Auth: JWT + bcrypt
  - Frontend: React + Vite + TypeScript + Tailwind CSS

## Objetivo

Construir una API de autenticación (registro, login y ruta protegida), probarla en Postman y conectar una interfaz web básica con Header, Main (formulario) y Footer.

## Paso 1 - Estructura inicial

**Acciones realizadas**

1. Se creó carpeta `backend`.
2. Se creó carpeta `frontend`.
3. Se creó carpeta `docs`.
4. Se creó archivo `docs/bitacora-evidencia-api.md`.

**Evidencia visual sugerida**

- Captura 1: Explorador de VS Code mostrando `backend`, `frontend`, `docs`.
- Captura 2: Archivo de bitácora abierto con este contenido inicial.

## Paso 2 - Inicialización del backend

**Acciones realizadas**

1. Se inicializó proyecto Node en `backend` con `npm init -y`.
2. Se instalaron dependencias de ejecución: express, cors, dotenv, jsonwebtoken, bcrypt, mysql2.
3. Se instalaron dependencias de desarrollo para TypeScript y tipados.
4. Se generó y ajustó `tsconfig.json`.
5. Se configuraron scripts `dev`, `build` y `start` en `package.json`.

**Evidencia visual sugerida**

- Captura 3: Terminal con instalaciones completadas.
- Captura 4: `package.json` mostrando scripts.
- Captura 5: `tsconfig.json` con `rootDir` y `outDir`.


## Paso 3 - Creación de Base de datos y tablas

**Acciones realizadas**
1. Se creó la base de datos `signlearn_api` en MySQL.
2. Se creó la tabla `users` con las columnas:
   - `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - `email` VARCHAR(255) NOT NULL UNIQUE
   - `password_hash` VARCHAR(255) NOT NULL
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**Comandos ejecutados (MySQL CLI)**
```sql
CREATE DATABASE signlearn_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE signlearn_api;
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Evidencia visual sugerida**
- Captura 6: Salida del monitor MySQL mostrando `SHOW DATABASES` con `signlearn_api`.
- Captura 7: Salida del monitor MySQL mostrando `SHOW TABLES` y `DESCRIBE users`.

**Notas**
- En Windows, ejecutaste mysql desde `"C:/Program Files/MySQL/MySQL Server 8.4/bin/mysql.exe" -u root -p`.
- Si prefieres usar la CLI estándar: `mysql -u root -p -h 127.0.0.1 -P 3306`.

## Paso 4 - Configuración inicial del backend y conexión MySQL

**Acciones realizadas**
1. Se creó `backend/.env.example` con variables DB y JWT.
2. Se añadió `backend/src/db.ts` que exporta un pool de conexiones usando `mysql2/promise`.
3. Se añadió `backend/src/server.ts` que monta un endpoint GET / para probar conexión a la DB.

**Cómo probar localmente**
1. Copiar `backend/.env.example` a `backend/.env` y completar `DB_PASS` con la contraseña local.
2. En `backend` ejecutar: `npm run dev`.
3. Abrir http://localhost:4000/ y verificar respuesta JSON con `status: 'ok'`.

**Evidencia visual sugerida**
- Captura 8: Archivo `backend/.env` con valores (oculta la contraseña si la subes a repositorio).
- Captura 9: Terminal mostrando `Server running on port 4000`.
- Captura 10: Navegador o Postman mostrando respuesta JSON `{ status: 'ok', db: [...] }`.

