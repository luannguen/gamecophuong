import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class ClassRepository extends BaseRepository {
    constructor() {
        super('classes');
    }

    /**
     * Get classes with filtering and search, including teacher info
     * @param {Object} params
     * @param {string} [params.search] Search query for class name
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getFiltered({ search } = {}) {
        try {
            // Select * from classes and join teachers(full_name)
            let query = this.supabase
                .from(this.tableName)
                .select('*, teachers (full_name, email)')
                .order('name', { ascending: true });

            if (search) {
                query = query.ilike('name', `%${search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map the data to flatten teacher name
            const mappedData = data.map(cls => ({
                ...cls,
                teacher_name: cls.teachers?.full_name || 'No Teacher',
                teacher_email: cls.teachers?.email
            }));

            return success(mappedData);
        } catch (error) {
            console.error('[ClassRepo] getFiltered error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Get all active classes for dropdowns (Simplified)
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getActiveClasses() {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('id, name')
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (error) throw error;
            return success(data);
        } catch (error) {
            // Fallback
            return success([]);
        }
    }
}

export const classRepository = new ClassRepository();
