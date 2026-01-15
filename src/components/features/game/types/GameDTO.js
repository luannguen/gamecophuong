/**
 * MiniGameDTO - Game data structure
 * @typedef {Object} MiniGameDTO
 * @property {string} id - Unique game identifier
 * @property {string} name - Game display name
 * @property {string} game_type - Type: 'hide_and_seek', 'word_match', 'listen_click'
 * @property {string} [skill_focus] - Primary skill: 'listening', 'speaking', 'reading'
 * @property {string} [description] - Game description
 * @property {string} [thumbnail_url] - Thumbnail image URL
 * @property {boolean} is_active - Whether game is available
 * @property {string} [created_at] - Creation timestamp
 */

/**
 * GameSessionDTO - Active game session
 * @typedef {Object} GameSessionDTO
 * @property {string} session_id - Unique session identifier
 * @property {string} game_id - Reference to mini_game
 * @property {string} student_id - Student playing
 * @property {string} state - 'intro', 'playing', 'review', 'result'
 * @property {number} score - Current score
 * @property {number} stars_earned - Stars earned (0-3)
 * @property {number} time_started - Start timestamp
 * @property {number} time_spent_seconds - Time spent
 */

export const GameTypes = {
    HIDE_AND_SEEK: 'hide_and_seek',
    WORD_MATCH: 'word_match',
    LISTEN_CLICK: 'listen_click',
};

export const GameStates = {
    INTRO: 'intro',
    PLAYING: 'playing',
    REVIEW: 'review',
    RESULT: 'result',
};

/**
 * Create empty game session
 * @param {string} gameId 
 * @param {string} studentId 
 * @returns {GameSessionDTO}
 */
export const createGameSession = (gameId, studentId) => ({
    session_id: `session_${Date.now()}`,
    game_id: gameId,
    student_id: studentId,
    state: GameStates.INTRO,
    score: 0,
    stars_earned: 0,
    time_started: Date.now(),
    time_spent_seconds: 0,
});
