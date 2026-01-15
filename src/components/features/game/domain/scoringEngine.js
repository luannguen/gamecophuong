/**
 * Game Domain - Scoring Engine
 * Business logic for game scoring and star calculations
 */

/**
 * Calculate stars based on score percentage
 * @param {number} score - Achieved score
 * @param {number} maxScore - Maximum possible score
 * @returns {number} - Stars (0-3)
 */
export const calculateStars = (score, maxScore) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 80) return 3;
    if (percentage >= 50) return 2;
    if (percentage > 0) return 1;
    return 0;
};

/**
 * Calculate score for finding an item (Hide & Seek)
 * @param {number} timeRemaining - Seconds remaining
 * @param {number} difficulty - Difficulty multiplier (1-3)
 * @returns {number} - Points earned
 */
export const calculateFindScore = (timeRemaining, difficulty = 1) => {
    const baseScore = 100;
    const timeBonus = Math.floor(timeRemaining * 2);
    return Math.floor((baseScore + timeBonus) * difficulty);
};

/**
 * Calculate score for correct answer (Word Match)
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {number} timeRemaining - Seconds remaining
 * @param {number} streak - Consecutive correct answers
 * @returns {number} - Points earned
 */
export const calculateAnswerScore = (isCorrect, timeRemaining, streak = 0) => {
    if (!isCorrect) return 0;
    const baseScore = 100;
    const timeBonus = Math.floor(timeRemaining * 1.5);
    const streakBonus = Math.min(streak * 10, 50);
    return baseScore + timeBonus + streakBonus;
};

/**
 * Get result message based on performance
 * @param {number} stars - Stars earned
 * @param {boolean} timeUp - Whether time ran out
 * @returns {{ title: string, message: string }}
 */
export const getResultMessage = (stars, timeUp = false) => {
    if (timeUp && stars === 0) {
        return { title: "Time's Up!", message: "Don't worry, you can try again!" };
    }
    if (stars >= 3) {
        return { title: 'Super Finder!', message: 'You found all the hidden items!' };
    }
    if (stars >= 2) {
        return { title: 'Great Job!', message: 'Excellent performance!' };
    }
    if (stars >= 1) {
        return { title: 'Good Try!', message: 'Keep practicing!' };
    }
    return { title: 'Nice Effort!', message: "Let's try again!" };
};

/**
 * Calculate max possible score for game type
 * @param {string} gameType - Type of game
 * @param {number} itemCount - Number of items/rounds
 * @returns {number} - Maximum possible score
 */
export const getMaxScore = (gameType, itemCount = 5) => {
    switch (gameType) {
        case 'hide_and_seek':
            return itemCount * 100; // Base 100 per item
        case 'word_match':
            return itemCount * 150; // Base + time bonus
        case 'listen_click':
            return itemCount * 120;
        default:
            return itemCount * 100;
    }
};
