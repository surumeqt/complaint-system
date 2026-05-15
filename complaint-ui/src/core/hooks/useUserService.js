import { useState } from "react";
import { UserService } from "../services/user.service";
import { ComplaintService } from "../services/complaint.service";

export default function useUserService() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateProfile = async (full_name, phone) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await UserService.updateProfile(full_name, phone);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getComplaintsByUser = async (user_id) => {
        setLoading(true);
        setError(null);
        try {
            const complaints = await ComplaintService.GetUserComplaintsByUserId(user_id);
            return complaints.data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };


    return {
        error,
        loading,
        success,
        updateProfile,
        getComplaintsByUser
    }
}