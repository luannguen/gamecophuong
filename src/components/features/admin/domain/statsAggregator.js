/**
 * Admin Domain - Stats Aggregator
 * Business logic for dashboard statistics
 */

/**
 * Calculate engagement rate
 * @param {number} activeStudents - Students active in period
 * @param {number} totalStudents - Total registered students
 * @returns {number} - Engagement percentage
 */
export const calculateEngagementRate = (activeStudents, totalStudents) => {
    if (totalStudents === 0) return 0;
    return Math.round((activeStudents / totalStudents) * 100);
};

/**
 * Calculate average score from scores array
 * @param {Array<{score: number}>} scores - Array of score objects
 * @returns {number} - Average score percentage
 */
export const calculateAverageScore = (scores) => {
    if (!scores || scores.length === 0) return 0;
    const sum = scores.reduce((acc, s) => acc + (s.score || 0), 0);
    return Math.round(sum / scores.length);
};

/**
 * Get period comparison (percentage change)
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {{ change: number, direction: 'up' | 'down' | 'same' }}
 */
export const getPeriodComparison = (current, previous) => {
    if (previous === 0) {
        return { change: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'same' };
    }
    const change = Math.round(((current - previous) / previous) * 100);
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
    return { change: Math.abs(change), direction };
};

/**
 * Group activities by type for display
 * @param {Array} activities - Raw activity records
 * @returns {Object} - Grouped activities
 */
export const groupActivitiesByType = (activities) => {
    return activities.reduce((acc, activity) => {
        const type = activity.type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(activity);
        return acc;
    }, {});
};

/**
 * Format relative time
 * @param {Date|string} timestamp - Timestamp to format
 * @returns {string} - Relative time string (e.g., "2m ago")
 */
export const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};
