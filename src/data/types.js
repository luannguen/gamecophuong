/**
 * Type Definitions and Error Codes
 * Following AI-CODING-RULES.txt - Result<T> pattern
 */

// Error Codes
export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    DUPLICATE_ERROR: 'DUPLICATE_ERROR',
}

// Result<T> helpers
export const success = (data) => ({
    success: true,
    data,
    error: null,
    code: null,
})

export const failure = (message, code = ErrorCodes.SERVER_ERROR) => ({
    success: false,
    data: null,
    error: message,
    code,
})

// Student DTO
export const StudentDTO = {
    id: '',
    display_name: '',
    avatar_url: '',
    pin_code: '',
    qr_code: '',
    total_score: 0,
    total_stars: 0,
    is_active: true,
}

// Category DTO
export const CategoryDTO = {
    id: '',
    name: '',
    slug: '',
    description: '',
    icon_url: '',
    color_code: '',
}

// Vocabulary DTO
export const VocabularyDTO = {
    id: '',
    category_id: '',
    word: '',
    meaning: '',
    pronunciation: '',
    image_url: '',
    audio_url: '',
    difficulty_level: 'beginner',
    usage_example: '',
}

// Mini Game DTO
export const MiniGameDTO = {
    id: '',
    name: '',
    slug: '',
    game_type: '',
    skill_focus: '',
    description: '',
    thumbnail_url: '',
    max_stars: 3,
    time_limit_seconds: null,
}

// Game Session DTO
export const GameSessionDTO = {
    id: '',
    student_id: '',
    game_id: '',
    category_id: '',
    start_time: '',
    end_time: null,
    status: 'in_progress',
    total_questions: 0,
    correct_answers: 0,
    score: 0,
    stars_earned: 0,
    time_spent_seconds: 0,
}

// Score DTO
export const ScoreDTO = {
    id: '',
    student_id: '',
    game_id: '',
    category_id: '',
    score: 0,
    stars: 0,
    completed_at: '',
}

// Video DTO
export const VideoDTO = {
    id: '',
    category_id: '',
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: 0,
    view_count: 0,
    is_featured: false,
}

// Challenge DTO
export const ChallengeDTO = {
    id: '',
    title: '',
    description: '',
    challenge_type: '',
    start_date: '',
    end_date: '',
    reward_points: 0,
    min_score_required: 0,
}

// Weekly Ranking DTO
export const WeeklyRankingDTO = {
    id: '',
    week_start: '',
    week_end: '',
    student_id: '',
    total_score: 0,
    total_stars: 0,
    games_played: 0,
    rank: 0,
}
