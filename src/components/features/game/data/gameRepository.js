import { supabase } from '../../../../data/supabaseClient';
import { success, failure, ErrorCodes } from '../../../../data/types';

/**
 * Game Repository - Data access layer for games
 */
export const gameRepository = {
    /**
     * Get all active games
     * @returns {Promise<Result<MiniGameDTO[]>>}
     */
    /**
     * Get active games, optionally filtered by topic
     * @param {string} [topicId] - Optional topic ID filter
     * @returns {Promise<Result<MiniGameDTO[]>>}
     */
    async getAll(topicId = null) {
        try {
            let query = supabase
                .from('mini_games')
                .select('*, video_categories(name, color, icon)')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (topicId) {
                query = query.eq('topic_id', topicId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return success(data || []);
        } catch (error) {
            console.error('Error fetching games:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Create a new game
     * @param {Object} gameData 
     */
    async create(gameData) {
        try {
            const { data, error } = await supabase
                .from('mini_games')
                .insert([gameData])
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('Error creating game:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Update an existing game
     * @param {string} id
     * @param {Object} updates
     */
    async update(id, updates) {
        try {
            const { data, error } = await supabase
                .from('mini_games')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return success(data);
        } catch (error) {
            console.error('Error updating game:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
    * Delete a game
    * @param {string} id 
    */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('mini_games')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return success(true);
        } catch (error) {
            console.error('Error deleting game:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Get game by ID
     * @param {string} gameId 
     * @returns {Promise<Result<MiniGameDTO>>}
     */
    async getById(gameId) {
        try {
            const { data, error } = await supabase
                .from('mini_games')
                .select('*, video_categories(*)')
                .eq('id', gameId)
                .single();

            if (error) throw error;
            if (!data) return failure(ErrorCodes.NOT_FOUND, 'Game not found');
            return success(data);
        } catch (error) {
            console.error('Error fetching game:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Save game score
     * @param {Object} scoreData - Score data to save
     * @returns {Promise<Result<void>>}
     */
    async saveScore(scoreData) {
        try {
            const { error } = await supabase.from('scores').insert(scoreData);
            if (error) throw error;
            return success(null);
        } catch (error) {
            console.error('Error saving score:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },

    /**
     * Get student's best score for a game
     * @param {string} studentId 
     * @param {string} gameId 
     * @returns {Promise<Result<number>>}
     */
    async getBestScore(studentId, gameId) {
        try {
            const { data, error } = await supabase
                .from('scores')
                .select('score')
                .eq('student_id', studentId)
                .eq('game_id', gameId)
                .order('score', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return success(data?.score || 0);
        } catch (error) {
            console.error('Error fetching best score:', error);
            return failure(ErrorCodes.DATABASE_ERROR, error.message);
        }
    },
};
