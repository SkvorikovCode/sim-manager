import { User, AuthResponse } from '@/types';

const API_BASE_URL = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Произошла ошибка при запросе' };
    }

    return { data };
  } catch (error) {
    return { error: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.' };
  }
}

export async function loginUser(phone: string, password: string): Promise<ApiResponse<AuthResponse>> {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

export async function requestPasswordReset(phone: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyResetCode(phone: string, code: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

export async function resetPassword(phone: string, code: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/auth/set-password', {
    method: 'POST',
    body: JSON.stringify({ phone, code, newPassword }),
  });
}

export async function getUserData(): Promise<ApiResponse<User>> {
  return fetchApi<User>('/user');
}

export async function logoutUser(): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/auth/logout', {
    method: 'POST',
  });
}