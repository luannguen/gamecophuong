import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';
import { classRepository } from '../../admin/data/classRepository';


class StudentRepository extends BaseRepository {
    constructor() {
        super('students');
    }

    /**
     * Login student by PIN code
     * @param {string} pinCode 
     * @returns {Promise<import('../../../../data/types').Result<object>>}
     */
    async login(pinCode) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('pin_code', pinCode)
                .single();

            if (error) throw error;
            if (!data) return failure('Invalid PIN code', ErrorCodes.NOT_FOUND);

            return success(data);
        } catch (error) {
            console.error('[StudentRepo] login error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Find student by display name
     * @param {string} name 
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async findByName(name) {
        try {
            const { data, error } = await this.supabase
                .from('students')
                .select('*')
                .ilike('display_name', `%${name}%`)
                .limit(1);

            if (error) throw error;
            // No failure if not found, just null data in Result pattern usually, 
            // or specific behavior. For strict find, maybe error.
            if (!data || data.length === 0) return failure('Student not found', ErrorCodes.NOT_FOUND);

            return success(data[0]);
        } catch (error) {
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    async getAll() {
        return super.getAll();
    }

    async delete(id) {
        try {
            const { error } = await this.supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return success(true);
        } catch (error) {
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }
    /**
     * Get students with filtering and search
     * @param {Object} params
     * @param {string} [params.search] Search query for display name
     * @param {string} [params.classFilter] Filter by class name
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getFiltered({ search, classFilter } = {}) {
        try {
            // 1. Fetch Classes for Mapping (Reuse secure logic from ClassRepo)
            let classMap = {};
            try {
                // Use classRepository to fetch via RPC if possible
                const { data: classes } = await classRepository.getActiveClasses();

                if (classes) {
                    classMap = classes.reduce((acc, cls) => {
                        acc[cls.id] = cls.name;
                        return acc;
                    }, {});
                }
            } catch (err) {
                console.warn('[StudentRepo] Class fetch exception (using ClassRepo):', err);
            }

            // 3. Query Students
            let query = this.supabase
                .from(this.tableName)
                .select('*')
                .order('display_name', { ascending: true });

            if (search) {
                query = query.ilike('display_name', `%${search}%`);
            }

            if (classFilter && classFilter !== 'All Classes') {
                // Assuming logic passed classId as classFilter, or we need to handle it.
                // The updated hook passes classId.
                query = query.eq('class_id', classFilter);
            }

            const { data, error } = await query;

            if (error) throw error;

            // 4. Map class names
            const mappedData = data.map(student => ({
                ...student,
                class_name: classMap[student.class_id] || 'Class Unavailable'
            }));

            return success(mappedData);
        } catch (error) {
            console.error('[StudentRepo] getFiltered error:', error);
            // Fallback for demo if blocking
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }
}

export const studentRepository = new StudentRepository();
