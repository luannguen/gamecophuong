/**
 * Student Domain - Ranking Rules
 * Business logic for student ranking calculations
 */

/**
 * Calculate star rating based on score percentage
 * @param {number} score - Current score
 * @param {number} maxScore - Maximum possible score
 * @returns {number} - Star rating (1-3)
 */
export const calculateStarRating = (score, maxScore) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 80) return 3;
    if (percentage >= 50) return 2;
    if (percentage > 0) return 1;
    return 0;
};

/**
 * Determine rank change indicator
 * @param {number} currentRank - Current rank position
 * @param {number} previousRank - Previous rank position
 * @returns {'up' | 'down' | 'same'} - Rank change direction
 */
export const getRankChange = (currentRank, previousRank) => {
    if (previousRank === null || previousRank === undefined) return 'same';
    if (currentRank < previousRank) return 'up';
    if (currentRank > previousRank) return 'down';
    return 'same';
};

/**
 * Calculate XP needed for next level
 * @param {number} currentLevel - Current student level
 * @returns {number} - XP needed for next level
 */
export const getXPForNextLevel = (currentLevel) => {
    return Math.floor(100 * Math.pow(1.5, currentLevel));
};

/**
 * Get rank tier based on total stars
 * @param {number} totalStars - Total accumulated stars
 * @returns {{ tier: string, name: string, minStars: number }}
 */
export const getRankTier = (totalStars) => {
    const tiers = [
        { tier: 'bronze', name: 'Bronze', minStars: 0 },
        { tier: 'silver', name: 'Silver', minStars: 500 },
        { tier: 'gold', name: 'Gold', minStars: 1500 },
        { tier: 'platinum', name: 'Platinum', minStars: 3000 },
        { tier: 'diamond', name: 'Diamond', minStars: 5000 },
    ];

    for (let i = tiers.length - 1; i >= 0; i--) {
        if (totalStars >= tiers[i].minStars) return tiers[i];
    }
    return tiers[0];
};
