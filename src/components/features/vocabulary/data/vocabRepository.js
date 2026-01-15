import { supabase } from '../../../../data/supabaseClient';
import { success, failure, ErrorCodes } from '../../../../data/types';

/**
 * Vocabulary Repository - Data access layer
 */
export const vocabRepository = {
    /**
     * Get all vocabulary
     * @param {Object} options - Query options
     * @returns {Promise<Result<VocabularyDTO[]>>}
     */
    async getAll(options = {}) {
        try {
            let query = supabase.from('vocabulary').select('*');

            if (options.category) {
                query = query.eq('category_id', options.category);
            }
            if (options.difficulty) {
                query = query.eq('difficulty_level', options.difficulty);
            }
            if (options.limit) {
                query = query.limit(options.limit);
            }

            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            return success(data || []);
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Get vocabulary by ID
     * @param {string} id 
     * @returns {Promise<Result<VocabularyDTO>>}
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('vocabulary')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return failure(ErrorCodes.NOT_FOUND, 'Vocabulary not found');
            return success(data);
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Create new vocabulary
     * @param {VocabularyDTO} vocabData 
     * @returns {Promise<Result<VocabularyDTO>>}
     */
    async create(vocabData) {
        try {
            const { data, error } = await supabase
                .from('vocabulary')
                .insert(vocabData)
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('Error creating vocabulary:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Update vocabulary
     * @param {string} id 
     * @param {Partial<VocabularyDTO>} updates 
     * @returns {Promise<Result<VocabularyDTO>>}
     */
    async update(id, updates) {
        try {
            const { data, error } = await supabase
                .from('vocabulary')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('Error updating vocabulary:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Delete vocabulary
     * @param {string} id 
     * @returns {Promise<Result<void>>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('vocabulary')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return success(null);
        } catch (error) {
            console.error('Error deleting vocabulary:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Get categories
     * @returns {Promise<Result<Array>>}
     */
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            return success(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },
};
