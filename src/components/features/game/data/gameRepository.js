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
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('mini_games')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            return success(data || []);
        } catch (error) {
            console.error('Error fetching games:', error);
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
                .select('*')
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
     * Get vocabulary for a game
     * @param {string} gameId 
     * @returns {Promise<Result<Array>>}
     */
    async getGameVocabulary(gameId) {
        try {
            const { data, error } = await supabase
                .from('game_vocabulary')
                .select('vocabulary(*)')
                .eq('game_id', gameId);

            if (error) throw error;
            return success(data?.map(gv => gv.vocabulary) || []);
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
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
