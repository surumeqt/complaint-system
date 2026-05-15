import { apiClient } from "../api-client";

export const ComplaintService = {
  CreateComplaint: async (formData) => {
    const response = await apiClient.post('/api/complaints', formData);
    return response.data;
  },

  GetComplaintByComplaintId: async (complaint_id) => {
    const response = await apiClient.get(`/api/complaints/${complaint_id}`);
    return response.data;
  },

  GetUserComplaintsByUserId: async (user_id) => {
    const response = await apiClient.get(`/api/complaints/user/${user_id}`);
    return response.data;
  },

  GetAllCategories: async () => {
    const response = await apiClient.get('/api/complaints/categories/all');
    return response.data;
  },
};