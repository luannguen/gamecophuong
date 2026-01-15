import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRepository } from '../data/adminRepository';

export function useAdminAuth() {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const stored = localStorage.getItem('current_admin');
        if (stored) {
            setAdmin(JSON.parse(stored));
        } else {
            // If we are on an admin page (not login), redirect.
            // Usually handled by the component or Layout.
        }
        setIsLoading(false);
    };

    const login = async (username, password) => {
        setIsLoading(true);
        const result = await adminRepository.login(username, password);

        if (result.success) {
            localStorage.setItem('current_admin', JSON.stringify(result.data));
            setAdmin(result.data);
            navigate('/admin/dashboard');
        }

        setIsLoading(false);
        return result;
    };

    const logout = () => {
        localStorage.removeItem('current_admin');
        setAdmin(null);
        navigate('/admin/login');
    };

    return {
        admin,
        isLoading,
        login,
        logout
    };
}
