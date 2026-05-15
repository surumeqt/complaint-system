import { apiClient } from "../api-client";

export const AuthService = {
    login: async (email, password) => {
      const response = await apiClient.post('/api/auth/login', { email, password });
      return response.data;
    },
    register: async (name, email, password) => {
      const response = await apiClient.post('/api/auth/register', { name, email, password });
      return response.data;
    },
    logout: async () => {
      await apiClient.post('/api/auth/logout');
    }
}