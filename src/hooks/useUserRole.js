import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { authRepository } from '../data/authRepository';

export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    PARENT: 'parent',
    STUDENT: 'student',
    GUEST: 'guest',
};

/**
 * Hook to get current user's role and permissions
 */
export const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkRole();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            checkRole();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const checkRole = async () => {
        setLoading(true);
        try {
            const { user, role: userRole, profile: userProfile } = await authRepository.getCurrentUser();

            if (!user) {
                setRole(USER_ROLES.GUEST);
                setProfile(null);
                setLoading(false);
                return;
            }

            setRole(userRole || USER_ROLES.GUEST);
            setProfile(userProfile);

        } catch (error) {
            console.error('Error checking role:', error);
            setRole(USER_ROLES.GUEST);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = async (permissionName) => {
        return await authRepository.hasPermission(permissionName);
    };

    const logout = async () => {
        await authRepository.logout();
        setRole(USER_ROLES.GUEST);
        setProfile(null);
    };

    return {
        role,
        profile,
        permissions,
        loading,
        isAdmin: role === USER_ROLES.ADMIN,
        isTeacher: role === USER_ROLES.TEACHER,
        isParent: role === USER_ROLES.PARENT,
        isStudent: role === USER_ROLES.STUDENT,
        isAuthenticated: role && role !== USER_ROLES.GUEST,
        hasPermission,
        logout,
        refresh: checkRole
    };
};
