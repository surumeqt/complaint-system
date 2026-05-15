import { apiClient } from "../api-client";

export const UserService = {
    getProfile: async () => {
        const response = await apiClient.get('/api/users/profile');
        return response.data;
    },
    updateProfile: async (name, phone_number) => {
        const response = await apiClient.put('/api/users/profile', { name, phone_number });
        return response.data;
    },
    getUserDashboardStats: async () => {
        const response = await apiClient.get('/api/users/dashboard');
        return response.data;
    }
}