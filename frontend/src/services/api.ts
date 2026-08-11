const API_URL = 'http://localhost:4000';

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return {
    status: response.status,
    data: result,
  };
}