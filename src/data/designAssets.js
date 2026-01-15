/**
 * Design Assets extracted from Stitch design files
 * All colors, fonts, icons, and image URLs from the mockups
 */

// ============================================
// COLOR PALETTE (from Tailwind config in designs)
// ============================================
export const COLORS = {
    // Primary teal color - main brand color
    primary: '#26d9d9',
    primaryDark: '#1ba9a9',  // Used for button shadows

    // Secondary pink - for videos, accents
    secondaryPink: '#FF8CBE',

    // Accent yellow - for challenges, stars, rewards
    accentYellow: '#FCCD2B',

    // Background colors
    backgroundLight: '#f6f8f8',
    backgroundDark: '#122020',

    // Success colors
    success: '#4CAF50',

    // Text colors
    textPrimary: '#0f1a1a',
    textSecondary: '#6B7280',  // gray-500
    textTertiary: '#9CA3AF',   // gray-400
};

// ============================================
// TYPOGRAPHY (from design files)
// ============================================
export const TYPOGRAPHY = {
    fontFamily: "'Spline Sans', sans-serif",
    fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    fontSizes: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
    },
};

// ============================================
// MATERIAL SYMBOLS ICONS (used in designs)
// ============================================
export const ICONS = {
    // Bottom Navigation
    home: 'home',
    games: 'sports_esports',    // or 'videogame_asset'
    videos: 'movie',
    ranking: 'leaderboard',
    add: 'add',

    // Action icons
    notifications: 'notifications',
    search: 'search',
    back: 'arrow_back_ios_new',
    close: 'close',
    settings: 'settings',
    favorite: 'favorite',

    // Game icons
    rocket: 'rocket_launch',
    play: 'play_arrow',
    playCircle: 'play_circle',
    trophy: 'trophy',
    star: 'star',
    stars: 'stars',
    timer: 'timer',
    schedule: 'schedule',
    hearing: 'hearing',
    mic: 'record_voice_over',
    book: 'menu_book',
    edit: 'edit',
    bolt: 'bolt',
    premium: 'workspace_premium',
    casino: 'casino',

    // Video icons
    smartDisplay: 'smart_display',
    volumeUp: 'volume_up',
    replay10: 'replay_10',
    forward10: 'forward_10',
    checkCircle: 'check_circle',
    lock: 'lock',
    autoAwesome: 'auto_awesome',

    // Category icons
    restaurant: 'restaurant',
    pets: 'pets',
    musicNote: 'music_note',
    familyHistory: 'family_history',
};

// ============================================
// IMAGE URLS (from designs - Google Cloud hosted)
// ============================================
export const IMAGES = {
    // Mascot - Koala
    mascotKoala: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3WQuD9CUJHnAbmASrH_GHIqrdP7UnGMMfJbqczcWWXgkivNe_EtT1Ab3j74WvO2jeDI03Z_Kc2x9PnY5uSs3rrmgO5306_gBDHBJO_elmG9jCCD7Fgt-37keSd1eJta0dt3z_EL7xOxUCV0WJk9W8nwjXOMTHqncFWNaXQaVSJUe533NBJIAYlsz50yNfAVXNO_Hc_ZUrceSlnPgU5zxQfm68aaDqREoDP8ua45o8_67DXTTaDJMDNCLldTkooLJ7TAPEPLoZZI',

    // Miss Phuong avatar
    missPhuong: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAENY7W2ZLjFE5dt6rBLkkTYwoDNTKKq-qweCaDBCYXz5j5QLk2N4eLTNvUjIIqhmQdC-VUr2E8bORWvnHyj31umYK_6BSSwOO7MOV5BX4Pl-OyLR90iqYunAwL5uua2Y50yjfaWfuh7EleQ0Z-VfAkzsunWQGTGFpROoWM-qPkz25Oqj5QkTHlvLY2thOe-aUhYQ1dUFupTEac619fFNPl_ja5BsRgslndSq94clrnFWl77vz5raDDHyEV2Jp_XozMSl4TlW-hS98',

    // Happy kid mascot for hero
    heroMascot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByJFR-YzkX7JGnxpFsjc5lyeLbeLD7w8Ff16TjyagxaLPRdo1v45fYb7VuB6HQIVbvMxPhmJkWE1yCNdD9jFLiGNvMRxFWy1yG3WzB22u87Kl6v8cGknU01CKs9iGhbq5dL_0qfr5bFbDc9hKdg5by3mEdBKz8NqgVuXFPIsBRRyxqd32k5WEzwwULlBvSN_dYh71a4chLjFIsmziMhTrPeb2pI_EC0d7DQbvW44K-axHq590M8Fy2UKPBWPJlFbnRoYt8faBSuVk',

    // Game controller illustration
    gameController: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdj0uX-lKSwan-F8TsEZhD424dC6s2A7PMb9kEF-OvTPBXnrgW-VsKvlWmvaubCif6bDw33CJyLXPfiiSRL1noIbX8D3sIOH1na9Mu3tFO_hvBlPkYwzD0Mzj19lfmndMvSKPM8JYtZlxQG_zLHozKrIvtFW9DFWIpL6FFQ_R0RNZ1zM1pAQ72D1n1iqZfzWHvT7vvSRjNWa7tX3avuLxWV2ssfWXSTGeDCXPImEiU0EUZI1-_XqRWMwY_UpyVaH_57ik0_LRu3Aw',

    // TV with play icon illustration
    tvPlay: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNokYlTa8twXdhiqXipx1-zh-X8H9wexFdm3Kj8wi4hJzfAXY_74wc8vSe27Jqc6CwzcXTqPdj7FhmIHJlK_wzz3B8yPcyTpj3ouafl6V4nLV2dTKGFPBhVFSakZc41UXDx-huLkhB9PU4xLW6g6L42yl3AGrYJ07fZZEswGX8l2emiSW0Yq1nwiEOhlrOMywCO-QcVP60_pBGlAHHT8Ds_X8aSDqt9KDPaq37hLPRGNvRfgsoTefroGLAoH6d4IryXCbgc0vrUD8',

    // Animals category - rabbit
    animalsRabbit: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2kT-byY3bM7YlgtQjXq7QjY_QgOGNpewACSIyNodDLsgiWghaKsnA8soJV91nS1HwFAf9W6QSJGhfC_T5M4MKkajXzDVdXvvkSiNy5G2tlyIUcB1HjQmesCP5ycdgAW_25gKcTawX-LtkD1SWkEQegDLv270KoeR7OUzSRuWp4yQGj0CHRq4XnDst1-xJxx71u6Ruij6spd1vrm89uDU_hqF48SKUCC3DHhFqBmf873h8a4uhbLtkzCoUuzjy_vUXdQ4GGOe3I0',

    // Family category illustration
    familyPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-D_16tkmmLlQK6de_4ARj0fGpfsFTEKg2dgMX2f9V42cOaGhpMwslqMo1JALBSiuZfokKVhPLe9Vlz-5lcXH9qBL9deTI7MLwg3AHw_C2aYEOnagdLvmDdn7X34riT023UnkNp6vIe44m7yodoFQrXvOXvqhxyrUxL9fD1EUZ_3z2liM1xP-Q87W-KDf66sa-MyC2MmVMCY-V7Rp7I1FCosQob6vpHCCuB14_tlqlZEA0-gtnR7YTkaCMjB3JXlAjgajaNiexpQ',

    // Daily routines - sun and clock
    dailyRoutines: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqEAi1c6fc-n4BsihOb3lE-Pbe8MKVixuHLe2-KXzSIL-Fu5fHX_lIOxu_31rtLqyN5vyaR_KaUEPUBiLKo7VuzNJvfd11YsbaDAb_Mxe2dLxUH1bJCHn-AiSHCOkIeNX5tkzgxuoJjUUO44cgBwFanp5rRjY5am68IkRmHo0wx64RhPgiLoOthjjaWIgADnAEc4hOxlqmGYTi9-zliEWfUW8PyZrGvQKlZ3szoMKSvptneh-SdpIXZq0AbtsI0GuMciU5tfOwGtA',

    // House illustration
    myHouse: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxmRMVM5Til8HoSOgyoa7DZJBTMXAEr6-7Cjy8w8QAIE9X6pIq50Wti7FmqnO8cnGPoNN8P4z0LzZZ5xE5IJmw5DV3nTxBA4Cf-nlLJVkOGAW-Xnecdqd73fAqfjEeeIVN0zXELpKcz5cAU2O0lFv5NIsW1cIHlNLN2_kdZoyYrzpsSdKgED3tVeIw-aRId3yOPa-UvW8zJn6VpPHUwI4OQniRiJvTgof3g4q7nWvyzCoTd0DCpovg2IDSaxC3hD025QlkkR4EGjs',

    // User avatars for rankings
    avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAew6dDu6BqlIwA5tI6A2CpsbNdq7EkgD2BY3O_ab8IwZSk6uvixvnKkLxFTybYtBmd64U4gKGmgeurdsFpC2My9CkypFtIefEipGGWw2g5PBzLnLTClioKUSxmCeB9oHR_jpjqq6QkMNqN9LhZptyU9_eLlC9WsnmR4388X6fUrbtncoFG-XJbB6Ttc1tcBG7eVVpFGEGEfHtZf2E9LuxeB4vyPkmUjoGMn83ScZMsuCOLyjqu4w9zOWUZ7lD8ClYX38BeY6rGA7c',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAoNalTj9BKpxKte-Hz4GOfdeEASdwY-ULjnayDLIt831xre77dU1QfzBt3sq9x2od9JgCKkpxPXsmadyJtjeyYQKIIALbvyzH80GoPWbTWwm04g8v9Yo0KwUL2K7cGhHVbN1qAIN3GrBdu61Cqtd8E3YbCTZfRwrBykO6iZT0eamjCduXv2uDhJJYRNL4iHbeHzpMsHxXTPHENiW0lStLyAgh6Nulf4BW0_ttYV8NVB6Xjy906aUq93a_1pcX3VmMNglnPh6eGhbY',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXHRHSnqgSaHU3cXULa7d0hnX8_izcvSHl-oi1zPq1yinMEySK0sGpSRKUObZPpavfWc2sO3iJL-6fQpQ508xXcQpzwuyeCNl6TVIBpfbU71jcCvqp34mKo8VnxEO2HCvQNenTYqYNVNDDWSftDzieGJJR_TpEZzhhgDVKI6HEuzaYQSI_vhg8cOFkReVzfIssmCclUnCKcb4KXubX3psxLEbAeed9Glgp5LZRo8iJMDZkKILvV2v4vUNJhKW41faN3An2Oson7sY',
    ],

    // Paw pattern background for games
    pawPattern: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbFWmOirqUfoZ7p0Cn2L228DAbYrCWR0Annm_iJVLSqOdwEKD6npF994f73viLpjHVfOlk8TmJhlnr3C9gNQ7aHY7XGCbEPE4YTlVASWn_DIv78mg2xJyfrX3fFaBL21qmrhzvThI-Sogcil2Mj8-AyBZyhuXoj5XCC-nc54vnyLFp6nMC2P74D8BvifORSrbsujMtfbyXni6W2G6E1tDcHg92tHqRZ2KvlVuYP0HVXuwqcDnzmE7HOt69Okn2g0wUerKisFB9qQg',
};

// ============================================
// GAME CATEGORIES DATA (from designs)
// ============================================
export const GAME_CATEGORIES = [
    {
        id: 'animals',
        name: 'Animals',
        subtitle: 'Listen & Click',
        skillType: 'Listening',
        icon: 'hearing',
        color: COLORS.primary,
        bgColor: `${COLORS.primary}1A`,  // 10% opacity
        borderColor: `${COLORS.primary}66`,
        image: IMAGES.animalsRabbit,
        stars: 120,
    },
    {
        id: 'family',
        name: 'My Family',
        subtitle: 'Word Match',
        skillType: 'Vocabulary',
        icon: 'menu_book',
        color: COLORS.secondaryPink,
        bgColor: `${COLORS.secondaryPink}1A`,
        borderColor: `${COLORS.secondaryPink}66`,
        image: IMAGES.familyPortrait,
        stars: 85,
    },
    {
        id: 'routines',
        name: 'Daily Routines',
        subtitle: 'Sentence Builder',
        skillType: 'Grammar',
        icon: 'edit',
        color: COLORS.accentYellow,
        bgColor: `${COLORS.accentYellow}1A`,
        borderColor: `${COLORS.accentYellow}66`,
        image: IMAGES.dailyRoutines,
        stars: 40,
    },
    {
        id: 'house',
        name: 'My House',
        subtitle: 'Speak Match',
        skillType: 'Speaking',
        icon: 'record_voice_over',
        color: COLORS.primary,
        bgColor: `${COLORS.primary}1A`,
        borderColor: `${COLORS.primary}66`,
        image: IMAGES.myHouse,
        stars: 210,
    },
];

// ============================================
// VIDEO CATEGORIES (from design)
// ============================================
export const VIDEO_CATEGORIES = [
    { id: 'routines', name: 'Routines', icon: 'restaurant', color: COLORS.primary },
    { id: 'animals', name: 'Animals', icon: 'pets', color: COLORS.secondaryPink },
    { id: 'grammar', name: 'Grammar', icon: 'menu_book', color: COLORS.accentYellow },
    { id: 'songs', name: 'Songs', icon: 'music_note', color: '#60A5FA' },  // blue-400
    { id: 'family', name: 'Family', icon: 'family_history', color: '#A78BFA' },  // purple-400
];

// ============================================
// RECOMMENDED VIDEOS DATA (from design)
// ============================================
export const RECOMMENDED_VIDEOS = [
    {
        id: 1,
        title: 'Learn about Pets with Miss Phượng',
        duration: '3 mins',
        level: 'Intermediate',
        levelColor: COLORS.primary,
        status: 'watched',
        image: IMAGES.tvPlay,
    },
    {
        id: 2,
        title: 'Fun with Greeting Friends',
        duration: '5 mins',
        level: 'Beginner',
        levelColor: COLORS.accentYellow,
        status: 'play_now',
        image: IMAGES.heroMascot,
    },
    {
        id: 3,
        title: "Grammar: Using 'Am, Is, Are'",
        duration: '4 mins',
        level: 'Advanced',
        levelColor: COLORS.secondaryPink,
        status: 'watched',
        image: IMAGES.gameController,
    },
];

// ============================================
// CSS VARIABLES STRING (for injection)
// ============================================
export const CSS_VARIABLES = `
:root {
    --color-primary: ${COLORS.primary};
    --color-primary-dark: ${COLORS.primaryDark};
    --color-secondary-pink: ${COLORS.secondaryPink};
    --color-accent-yellow: ${COLORS.accentYellow};
    --color-background-light: ${COLORS.backgroundLight};
    --color-background-dark: ${COLORS.backgroundDark};
    --color-success: ${COLORS.success};
    --color-text-primary: ${COLORS.textPrimary};
    --color-text-secondary: ${COLORS.textSecondary};
    --color-text-tertiary: ${COLORS.textTertiary};
    
    --font-family: ${TYPOGRAPHY.fontFamily};
    
    --shadow-toy: 0 8px 0px rgba(0, 0, 0, 0.05);
    --shadow-btn: 0 6px 0 ${COLORS.primaryDark};
}
`;

export default {
    COLORS,
    TYPOGRAPHY,
    ICONS,
    IMAGES,
    GAME_CATEGORIES,
    VIDEO_CATEGORIES,
    RECOMMENDED_VIDEOS,
    CSS_VARIABLES,
};
