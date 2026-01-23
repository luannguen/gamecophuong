import { supabase } from './supabaseClient';
import { success, failure, ErrorCodes } from './types';

/**
 * Auth Repository - Refactored for RBAC Best Practices
 * Uses Secure RPC for Role and Permission checking
 */
class AuthRepository {
    /**
     * Login with email/password and determine role via Server-Side Function
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async login(email, password) {
        try {
            // 1. Authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                console.error('[AuthRepo] Login error:', authError);
                return failure(authError.message, ErrorCodes.UNAUTHORIZED);
            }

            // 2. Determine role using Secure RPC (server-side logic)
            // No client-side table querying, no bypassing RLS
            const { data: roleData, error: rpcError } = await supabase.rpc('get_user_role_profile');

            if (rpcError) {
                console.error('[AuthRepo] RPC Error:', rpcError);
                await supabase.auth.signOut(); // Security: Logout if role check fails
                return failure('Lỗi hệ thống khi xác thực quyền hạn. Vui lòng thử lại.', ErrorCodes.NETWORK_ERROR);
            }

            if (!roleData) {
                console.warn('[AuthRepo] No role found for user');
                await supabase.auth.signOut();
                return failure('Tài khoản của bạn chưa được cấp quyền truy cập.', ErrorCodes.FORBIDDEN);
            }

            // 3. Store session info (Clean & Minimal)
            localStorage.setItem('user_role', roleData.role);
            localStorage.setItem('user_profile', JSON.stringify(roleData.profile));

            // Legacy storage support for existing components (can be removed later)
            if (roleData.role === 'admin') localStorage.setItem('current_admin', JSON.stringify(roleData.profile));
            if (roleData.role === 'teacher') localStorage.setItem('current_teacher', JSON.stringify(roleData.profile));
            if (roleData.role === 'parent') localStorage.setItem('current_parent', JSON.stringify(roleData.profile));

            return success({
                user: authData.user,
                role: roleData.role,
                profile: roleData.profile
            });

        } catch (error) {
            console.error('[AuthRepo] Unexpected error:', error);
            return failure('Đã xảy ra lỗi không mong muốn.', ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Get current session and user data (Refactored)
     */
    async getCurrentUser() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                return { user: null, role: null, profile: null };
            }

            // Sync check with RPC to ensure role validity
            const { data: roleData, error } = await supabase.rpc('get_user_role_profile');

            if (error || !roleData) {
                return { user: session.user, role: null, profile: null };
            }

            return {
                user: session.user,
                role: roleData.role,
                profile: roleData.profile
            };
        } catch (error) {
            console.error('[AuthRepo] getCurrentUser error:', error);
            return { user: null, role: null, profile: null };
        }
    }

    /**
     * Logout
     */
    async logout() {
        await supabase.auth.signOut();
        // Clear all auth related storage
        const keysToRemove = [
            'user_role', 'user_profile',
            'current_admin', 'current_teacher', 'current_student', 'current_parent',
            'student_pin'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    /**
     * Get redirect path based on role
     * @param {string} role 
     */
    getRedirectPath(role) {
        switch (role) {
            case 'admin': return '/admin/dashboard';
            case 'teacher': return '/teacher/dashboard';
            case 'parent': return '/parent/dashboard';
            case 'student': return '/student/home';
            default: return '/';
        }
    }
}

export const authRepository = new AuthRepository();
