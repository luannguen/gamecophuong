/**
 * VocabularyDTO - Vocabulary data structure
 * @typedef {Object} VocabularyDTO
 * @property {string} id - Unique identifier
 * @property {string} word - English word
 * @property {string} meaning - Vietnamese meaning
 * @property {string} [category_id] - Category reference
 * @property {string} difficulty_level - 'easy', 'medium', 'hard'
 * @property {string} [image_url] - Illustration URL
 * @property {string} [audio_url] - Pronunciation audio URL
 * @property {string} [created_at] - Creation timestamp
 */

export const DifficultyLevels = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
};

/**
 * Create empty vocabulary item
 * @returns {VocabularyDTO}
 */
export const createVocabularyItem = () => ({
    id: '',
    word: '',
    meaning: '',
    category_id: null,
    difficulty_level: DifficultyLevels.EASY,
    image_url: null,
    audio_url: null,
});
