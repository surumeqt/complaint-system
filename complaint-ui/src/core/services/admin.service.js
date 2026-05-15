import { apiClient } from '../api-client';

export const AdminService = {
    updateComplaintStatus: async (complaintId, status) => {
        const response = await apiClient.put(`/api/complaints/${complaintId}/status`, { status });
        return response.data;
    },

    createResponseToComplaint: async (complaintId, response) => {
        const responseData = await apiClient.post(`/api/complaints/${complaintId}/response`, { response });
        return responseData.data;
    },

    getAllComplaints: async () => {
        const response = await apiClient.get('/api/admin/complaints');
        return response.data;
    },

    getResolutionStatus: async () => {
        const response = await apiClient.get('/api/reports/resolution-status');
        return response.data;
    },

    getCategoryReport: async () => {
        const response = await apiClient.get('/api/reports/complaint-category');
        return response.data;
    }
}