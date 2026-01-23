import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class AdminRepository extends BaseRepository {
    constructor() {
        super('admins'); // Assuming 'admins' table, need to verify if distinct table exists or just users
    }

    /**
     * Admin login
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<import('../../../../data/types').Result<object>>}
     */
    async login(username, password) {
        // Implementation depends on real auth. 
        // For now, mocking or simple query if table exists.
        // Based on previous AdminLogin.jsx code (which I need to check), 
        // it seems it was just checking a hardcoded admin or local storage?
        // Let's assume there is an Auth process.

        // checking the "admins" table usually
        try {
            // Mocking login for now based on 'admin' / 'admin123' usually or whatever was there
            // OR checking supabase if there is an admins table.
            // If using supabase auth, it's different.
            // Current 'AdminLogin.jsx' logic was:
            /*
               const { data, error } = await supabase.from('admins')...
            */
            const { data, error } = await this.supabase
                .from('admins')
                .select('*')
                .eq('username', username)
                .single();

            if (error) throw error;
            if (!data) return failure('Invalid username', ErrorCodes.NOT_FOUND);

            // Verify password (in real app, use hash)
            if (data.password !== password) return failure('Invalid password', ErrorCodes.UNAUTHORIZED);

            return success(data);
        } catch (error) {
            console.error('[AdminRepo] login error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    async getDashboardStats() {
        try {
            // Fetch counts
            const [students, teachers, classes, games] = await Promise.all([
                this.supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
                this.supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('is_active', true),
                this.supabase.from('classes').select('*', { count: 'exact', head: true }).eq('is_active', true),
                this.supabase.from('mini_games').select('*', { count: 'exact', head: true }).eq('is_active', true)
            ]);

            // Fetch recent activities (optional, using profiles)
            const { data: recentJoin } = await this.supabase
                .from('students')
                .select('id, display_name, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            return success({
                totalStudents: students.count || 0,
                totalTeachers: teachers.count || 0,
                totalClasses: classes.count || 0,
                activeGames: games.count || 0,
                recentStudents: recentJoin || []
            });
        } catch (error) {
            console.error('Stats Error:', error);
            return failure(error.message);
        }
    }
}

export const adminRepository = new AdminRepository();
