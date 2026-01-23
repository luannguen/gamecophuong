import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authRepository } from '../data/authRepository';
import { studentRepository } from '../components/features/student/data/studentRepository';

/**
 * Unified Auth Hook - Manages all authentication flows
 * Supports: Admin, Teacher, Parent (email/password) and Student (PIN/quick login)
 */
export function useUnifiedAuth() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!user || !!profile;

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Check existing auth session
     */
    const checkAuth = async () => {
        setIsLoading(true);
        try {
            // First check Supabase Auth (admin/teacher/parent)
            const result = await authRepository.getCurrentUser();

            if (result.user && result.role) {
                setUser(result.user);
                setRole(result.role);
                setProfile(result.profile);

                // If on login page and authenticated, redirect
                if (location.pathname === '/login' ||
                    location.pathname === '/student/login' ||
                    location.pathname === '/admin/login' ||
                    location.pathname === '/parent/login') {
                    redirectToDashboard(result.role);
                }
            } else {
                // Check localStorage for student session
                const storedStudent = localStorage.getItem('current_student');
                if (storedStudent) {
                    const studentData = JSON.parse(storedStudent);
                    setProfile(studentData);
                    setRole('student');

                    if (location.pathname === '/login' ||
                        location.pathname === '/student/login') {
                        redirectToDashboard('student');
                    }
                }
            }
        } catch (error) {
            console.error('[useUnifiedAuth] Check auth error:', error);
        }
        setIsLoading(false);
    };

    /**
     * Login with email/password (Admin, Teacher, Parent)
     */
    const loginWithEmail = async (email, password) => {
        setIsLoading(true);
        try {
            const result = await authRepository.login(email, password);

            if (result.success) {
                const { user: authUser, role: userRole, profile: userProfile } = result.data;
                setUser(authUser);
                setRole(userRole);
                setProfile(userProfile);

                // Store for local reference
                if (userRole === 'admin') {
                    localStorage.setItem('current_admin', JSON.stringify(userProfile));
                } else if (userRole === 'teacher') {
                    localStorage.setItem('current_teacher', JSON.stringify(userProfile));
                }

                redirectToDashboard(userRole);
                setIsLoading(false);
                return { success: true };
            }

            setIsLoading(false);
            return { success: false, error: result.error || 'Đăng nhập không thành công' };
        } catch (error) {
            console.error('[useUnifiedAuth] Email login error:', error);
            setIsLoading(false);
            return { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' };
        }
    };

    /**
     * Login with PIN code (Registered Students)
     */
    const loginWithPin = async (pin) => {
        setIsLoading(true);
        try {
            const result = await studentRepository.login(pin);

            if (result.success) {
                const studentData = result.data;
                localStorage.setItem('current_student', JSON.stringify(studentData));
                localStorage.removeItem('is_guest');
                localStorage.setItem('student_pin', pin);

                setProfile(studentData);
                setRole('student');

                redirectToDashboard('student');
                setIsLoading(false);
                return { success: true };
            }

            setIsLoading(false);
            return { success: false, error: result.error === 'Invalid PIN code' ? 'Mã PIN không đúng' : 'Đăng nhập không thành công' };
        } catch (error) {
            console.error('[useUnifiedAuth] PIN login error:', error);
            setIsLoading(false);
            return { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' };
        }
    };

    /**
     * Quick login as guest student
     */
    const quickLogin = async (name, className = '') => {
        setIsLoading(true);
        try {
            // Try to find existing student
            const result = await studentRepository.findByName(name);

            let studentData;
            let isGuest = false;

            if (result.success && result.data && result.data.length > 0) {
                studentData = result.data[0];
            } else {
                // Create guest profile
                studentData = {
                    display_name: name,
                    student_class: className || null,
                    total_score: 0,
                    total_stars: 0,
                    is_active: true
                };
                isGuest = true;
            }

            localStorage.setItem('current_student', JSON.stringify(studentData));
            if (isGuest) {
                localStorage.setItem('is_guest', 'true');
            } else {
                localStorage.removeItem('is_guest');
            }

            setProfile(studentData);
            setRole('student');

            redirectToDashboard('student');
            setIsLoading(false);
            return { success: true, isGuest };
        } catch (error) {
            console.error('[useUnifiedAuth] Quick login error:', error);
            setIsLoading(false);
            return { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' };
        }
    };

    /**
     * Demo login (for testing without auth)
     */
    const demoLogin = async (targetRole = 'admin') => {
        setIsLoading(true);

        const demoProfiles = {
            admin: { id: 'demo-admin', display_name: 'Demo Admin', email: 'demo@admin.com' },
            teacher: { id: 'demo-teacher', display_name: 'Demo Teacher', email: 'demo@teacher.com' },
            student: { id: 'demo-student', display_name: 'Demo Student', total_score: 100, total_stars: 5 }
        };

        const profile = demoProfiles[targetRole] || demoProfiles.admin;

        if (targetRole === 'student') {
            localStorage.setItem('current_student', JSON.stringify(profile));
            localStorage.setItem('is_guest', 'true');
        } else if (targetRole === 'admin') {
            localStorage.setItem('current_admin', JSON.stringify(profile));
            localStorage.setItem('user_role', 'admin');
        } else if (targetRole === 'teacher') {
            localStorage.setItem('current_teacher', JSON.stringify(profile));
            localStorage.setItem('user_role', 'teacher');
        }

        setProfile(profile);
        setRole(targetRole);

        redirectToDashboard(targetRole);
        setIsLoading(false);
        return { success: true };
    };

    /**
     * Logout - clear all sessions
     */
    const logout = useCallback(async () => {
        try {
            await authRepository.logout();
        } catch (error) {
            console.error('[useUnifiedAuth] Logout error:', error);
        }

        // Clear all local storage
        localStorage.removeItem('current_student');
        localStorage.removeItem('current_admin');
        localStorage.removeItem('current_teacher');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_profile');
        localStorage.removeItem('student_pin');
        localStorage.removeItem('is_guest');

        setUser(null);
        setRole(null);
        setProfile(null);

        navigate('/login');
    }, [navigate]);

    /**
     * Redirect to appropriate dashboard based on role
     */
    const redirectToDashboard = useCallback((userRole) => {
        const paths = {
            admin: '/admin/dashboard',
            teacher: '/teacher/dashboard',
            parent: '/parent/dashboard',
            student: '/student/home'
        };

        const targetPath = paths[userRole] || '/login';
        navigate(targetPath);
    }, [navigate]);

    return {
        // State
        user,
        role,
        profile,
        isLoading,
        isAuthenticated,

        // Actions
        loginWithEmail,
        loginWithPin,
        quickLogin,
        demoLogin,
        logout,

        // Helpers
        redirectToDashboard,
        checkAuth
    };
}
