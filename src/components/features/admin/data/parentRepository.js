import { BaseRepository } from '../../../../data/repositories/baseRepository';
import { success, failure, ErrorCodes } from '../../../../data/types';

class ParentRepository extends BaseRepository {
    constructor() {
        super('parents');
    }

    /**
     * Get parents with filtering and search
     * @param {Object} params
     * @param {string} [params.search] Search query for name or email
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getFiltered({ search } = {}) {
        try {
            let query = this.supabase
                .from(this.tableName)
                // Select parent fields and join through parent_students to get student names
                .select('*, parent_students ( students ( display_name ) )')
                .order('created_at', { ascending: false });

            if (search) {
                query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map data to format children names closer to the root
            const mappedData = data.map(parent => {
                const children = parent.parent_students?.map(link => link.students?.display_name).filter(Boolean) || [];
                return {
                    ...parent,
                    children_names: children
                };
            });

            return success(mappedData);
        } catch (error) {
            console.error('[ParentRepo] getFiltered error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Get students linked to a parent
     * @param {string} parentId 
     * @returns {Promise<import('../../../../data/types').Result<object[]>>}
     */
    async getChildren(parentId) {
        try {
            const { data, error } = await this.supabase
                .from('parent_students')
                .select(`
                    id,
                    student_id,
                    relationship,
                    students:student_id (
                        id,
                        display_name,
                        pin_code,
                        class_id,
                        avatar_url
                    )
                `)
                .eq('parent_id', parentId);

            if (error) throw error;

            // Flatten structure
            const children = data.map(item => ({
                link_id: item.id,
                relationship: item.relationship,
                ...item.students
            }));

            return success(children);
        } catch (error) {
            console.error('[ParentRepo] getChildren error:', error);
            return failure(error.message, ErrorCodes.NETWORK_ERROR);
        }
    }

    /**
     * Link a student to a parent
     * @param {string} parentId 
     * @param {string} studentId 
     * @param {string} relationship 
     */
    async linkStudent(parentId, studentId, relationship = 'parent') {
        try {
            // Check if already exists
            const { data: existing } = await this.supabase
                .from('parent_students')
                .select('id')
                .eq('parent_id', parentId)
                .eq('student_id', studentId)
                .maybeSingle();

            if (existing) return success(existing);

            const { data, error } = await this.supabase
                .from('parent_students')
                .insert([{
                    parent_id: parentId,
                    student_id: studentId,
                    relationship
                }])
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    }

    /**
     * Remove student link
     * @param {string} parentId 
     * @param {string} studentId 
     */
    async unlinkStudent(parentId, studentId) {
        try {
            const { error } = await this.supabase
                .from('parent_students')
                .delete()
                .eq('parent_id', parentId)
                .eq('student_id', studentId);

            if (error) throw error;
            return success(true);
        } catch (error) {
            return failure(error.message, ErrorCodes.SERVER_ERROR);
        }
    }
}

export const parentRepository = new ParentRepository();
