/**
 * Vocabulary Domain - Difficulty Rules
 * Business logic for vocabulary difficulty
 */

import { DifficultyLevels } from '../types/VocabularyDTO';

/**
 * Get difficulty multiplier for scoring
 * @param {string} difficulty - Difficulty level
 * @returns {number} - Multiplier (1-3)
 */
export const getDifficultyMultiplier = (difficulty) => {
    switch (difficulty) {
        case DifficultyLevels.EASY: return 1;
        case DifficultyLevels.MEDIUM: return 1.5;
        case DifficultyLevels.HARD: return 2;
        default: return 1;
    }
};

/**
 * Suggest difficulty based on word length
 * @param {string} word - English word
 * @returns {string} - Suggested difficulty
 */
export const suggestDifficulty = (word) => {
    const length = word.length;
    if (length <= 4) return DifficultyLevels.EASY;
    if (length <= 7) return DifficultyLevels.MEDIUM;
    return DifficultyLevels.HARD;
};

/**
 * Filter vocabulary by difficulty for game
 * @param {Array} vocabulary - Vocabulary list
 * @param {string} targetDifficulty - Target difficulty
 * @returns {Array} - Filtered list
 */
export const filterByDifficulty = (vocabulary, targetDifficulty) => {
    if (!targetDifficulty || targetDifficulty === 'all') return vocabulary;
    return vocabulary.filter(v => v.difficulty_level === targetDifficulty);
};

/**
 * Get random vocabulary items
 * @param {Array} vocabulary - Full vocabulary list
 * @param {number} count - Number of items to get
 * @returns {Array} - Random subset
 */
export const getRandomVocabulary = (vocabulary, count = 5) => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

/**
 * Group vocabulary by category
 * @param {Array} vocabulary - Vocabulary list
 * @returns {Object} - Grouped by category
 */
export const groupByCategory = (vocabulary) => {
    return vocabulary.reduce((acc, vocab) => {
        const category = vocab.category_id || 'uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(vocab);
        return acc;
    }, {});
};
