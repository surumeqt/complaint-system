import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";
import useAuth from "../hooks/useAuth";
import ErrorPageComponent from "../../components/ErrorPageComponent";

export default function AuthGuard({ children, allowedRole}) {
    const { user, setUser } = useAuth();
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {

            if (user) {
                if (isMounted) {
                    setStatus(user.role === allowedRole ? 'authorized' : 'forbidden');
                }
                return;
            }

            try {
                const userData = await UserService.getProfile();
                if (isMounted) {
                    setUser(userData);
                    setStatus(userData.role === allowedRole ? 'authorized' : 'forbidden');
                }
            } catch (err) {
                console.error('Error verifying session:', err);
                if (isMounted) {
                    setStatus('unauthorized');
                }
            }
        };

        checkAuth();
        return () => { isMounted = false; };
    }, [user, allowedRole, setUser]);

    // Loading state while checking session
    if (status === 'checking') {
        return (
            <div className="h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Error handling based on verification result
    if (status === 'unauthorized') return <ErrorPageComponent status={401} />;
    if (status === 'forbidden') return <ErrorPageComponent status={403} />;

    return children;
}
