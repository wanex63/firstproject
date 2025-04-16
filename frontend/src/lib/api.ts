const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface ApiConfig {
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const config = getConfig();
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const config = getConfig('POST', data);
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return handleResponse(response);
  },
};

function getConfig(method = 'GET', data?: unknown): RequestInit {
  const config: ApiConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return {
    method,
    headers: config.headers,
    body: data ? JSON.stringify(data) : undefined,
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}