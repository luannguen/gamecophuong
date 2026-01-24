/**
 * Comprehensive list of Material Symbols for English Learning App
 * Categorized for easier selection in Admin UI
 * UPDATED: Optimized for standard Material Icons support to prevent text rendering issues
 * SAFE LIST V3
 */

export const ICON_LIBRARY = {
    "Animals & Nature": [
        "pets", "nature", "nature_people", "landscape", "wb_sunny", "brightness_3", "wb_cloudy",
        "opacity", "filter_drama", "waves", "terrain", "park", "spa", "local_florist",
        "bug_report", "child_friendly", "favorite", "star_rate"
    ],
    "School & Education": [
        "school", "menu_book", "import_contacts", "history_edu", "edit", "brush",
        "palette", "square_foot", "science", "biotech", "calculate", "functions",
        "lightbulb", "psychology", "assignment", "grade", "star", "workspace_premium",
        "class", "book", "library_books", "cast_for_education", "language", "translate"
    ],
    "Food & Drink": [
        "restaurant", "restaurant_menu", "local_dining", "lunch_dining", "breakfast_dining",
        "local_cafe", "local_bar", "kitchen", "cake", "icecream", "fastfood", "local_pizza",
        "local_drink", "set_meal", "emoji_food_beverage", "free_breakfast"
    ],
    "Sports & Activities": [
        "sports_soccer", "sports_basketball", "sports_tennis", "sports_volleyball", "sports_rugby",
        "sports_baseball", "sports_golf", "sports_cricket", "sports_mma", "sports_motorsports",
        "pool", "surfing", "rowing", "hiking", "directions_bike", "directions_run",
        "directions_walk", "fitness_center", "self_improvement"
    ],
    "Travel & Vehicles": [
        "flight", "flight_takeoff", "flight_land", "airplanemode_active", "rocket",
        "directions_car", "directions_bus", "tram", "train", "subway", "directions_boat",
        "motorcycle", "airport_shuttle", "rv_hookup", "agriculture", "local_shipping", "local_taxi",
        "commute", "traffic", "map", "explore", "place", "my_location", "navigation"
    ],
    "Music & Arts": [
        "music_note", "music_video", "headset", "mic", "speaker", "radio", "album",
        "library_music", "queue_music", "movie", "movie_filter", "theaters", "videocam",
        "camera_alt", "photo_library", "collections", "image", "brush", "filter_frames", "color_lens"
    ],
    "Technology": [
        "computer", "laptop", "smartphone", "tablet", "watch", "tv", "videogame_asset",
        "mouse", "keyboard", "memory", "router", "wifi", "battery_full", "power",
        "settings", "build", "print", "scanner", "usb", "sd_card", "sim_card"
    ],
    "Family & People": [
        "family_restroom", "groups", "group", "person", "face", "child_care",
        "accessibility", "pregnant_woman", "sentiment_satisfied", "sentiment_very_satisfied",
        "sentiment_dissatisfied", "mood", "mood_bad", "emoji_emotions", "people"
    ],
    "Home & Living": [
        "home", "apartment", "house", "weekend", "king_bed", "bathtub",
        "kitchen", "meeting_room", "lightbulb_outline", "deck", "fence", "balcony"
    ],
    "Clothes & Accessories": [
        "checkroom", "shopping_bag", "shopping_cart", "store", "watch",
        "local_mall", "umbrella", "local_laundry_service", "style", "loyalty"
    ]
};

// Flattened list if needed
export const ALL_ICONS = Object.values(ICON_LIBRARY).flat();
