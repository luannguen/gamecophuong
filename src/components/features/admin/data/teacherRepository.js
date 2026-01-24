import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class TeacherRepository extends BaseRepository {
    constructor() {
        super('teachers');
    }

    /**
     * Get teachers with filtering and search
     * @param {Object} params
     * @param {string} [params.search] Search query for display name or email
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getFiltered({ search } = {}) {
        try {
            let query = this.supabase
                .from(this.tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (search) {
                query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('[TeacherRepo] getFiltered error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }
}

export const teacherRepository = new TeacherRepository();
