import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authRepository } from '../../../../data/authRepository';

/**
 * Universal Auth Hook - Used by Admin Login page
 * Handles login and redirects based on role
 */
export function useAdminAuth() {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setIsLoading(true);

        // 1. DEV BYPASS / LOCAL CHECK
        // Check local storage primarily to avoid DB errors blocking admin access
        const storedRole = localStorage.getItem('user_role');
        const storedAdmin = localStorage.getItem('current_admin');

        if (storedRole === 'admin' && storedAdmin) {
            const adminData = JSON.parse(storedAdmin);
            setAdmin({ user: adminData, role: 'admin' });

            // Redirect if on login pages
            if (location.pathname.includes('/login')) {
                navigate('/admin/dashboard');
            }
            setIsLoading(false);
            return;
        }

        // 2. SUPABASE CHECK (Fallback)
        try {
            const result = await authRepository.getCurrentUser();

            if (result.user && result.role === 'admin') {
                setAdmin(result);
                if (location.pathname.includes('/login')) {
                    navigate('/admin/dashboard');
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
        setIsLoading(false);
    };

    const login = async (email, password) => {
        setIsLoading(true);
        const result = await authRepository.login(email, password);

        if (result.success) {
            const { role, profile } = result.data;

            // Store for local reference
            if (role === 'admin') {
                localStorage.setItem('current_admin', JSON.stringify(profile));
                setAdmin(result.data);
                navigate('/admin/dashboard');
            } else if (role === 'teacher') {
                localStorage.setItem('current_teacher', JSON.stringify(profile));
                navigate('/teacher/dashboard');
            } else {
                // Student or unknown role
                navigate('/student/home');
            }
        }

        setIsLoading(false);
        return result;
    };

    const logout = async () => {
        await authRepository.logout();
        setAdmin(null);
        navigate('/student/login');
    };

    return {
        admin,
        isLoading,
        login,
        logout
    };
}
