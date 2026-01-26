# Student UI Specification

## 1. Overview
The Student Interface is designed for engagement (Mobile-First, Gamified) and ease of navigation. The flow follows a strict hierarchy: `Home -> Topic Selection -> Mini-Game Selection -> Gameplay`.

## 2. Navigation Structure (Bottom Tab Bar)
Visible on all main screens (Home, Games, Videos, Ranking).
- **Home**: Dashboard with "Continue Learning" and suggestions.
- **Games**: The central hub for all interaction.
- **Videos**: Passive learning library.
- **Ranking**: Social motivation (Leaderboards).
- **Profile** (Top Right on Home): User stats and settings.

## 3. Game Flow (Detailed)

### 3.1 Step 1: Entry Point (Games Tab)
- **UI**: Grid of "Topics" (or Units).
- **Items**: Animals, My Family, Daily Routines, My House, etc.
- **Visuals**: Each topic has a large, colorful illustration.
- **Action**: Tap a Topic Card -> Navigate to `Topic Detail / Minigame Selection`.

### 3.2 Step 2: Minigame Selection (Topic Detail)
- **Context**: User has selected a topic (e.g., "Animals").
- **UI**: List/Grid of available Game Types for this topic.
- **Game Types**:
    1.  **Listening** - Listen & Tap
    2.  **Listening** - Listen & Choose Word
    3.  **Speaking** - Speak Match
    4.  **Matching** - Drag & Drop
    5.  **Sentence** - Sentence Builder
    6.  **Hide & Seek** - Find Hidden Objects
- **Status**: Showing locked/unlocked status based on progress.
- **Action**: Tap a Game Type -> Navigate to `Game Intro`.

### 3.3 Step 3: Game Intro (Common Screen)
Before any game starts, show an overlay/screen.
- **Content**:
    - Game Name (e.g., "Listen & Tap").
    - Topic Name (e.g., "Animals").
    - Instructions (Short text + Audio icon).
    - "Play" Button (prominent).
    - Current High Score (if any).

### 3.4 Step 4: Gameplay Loop
(See `game_mechanics.md` for specific mechanics per game type)
- **Global UI Elements**:
    - **Progress Bar**: Top of screen.
    - **Exit Button**: Top Left (Pauses game).
    - **Audio Controls**: Replay instructions/audio.

### 3.5 Step 5: Result Screen
- **Trigger**: Completion of all questions or Time Up.
- **UI**:
    - Star Rating (1-3 Stars).
    - Score / XP Earned.
    - Rewards (Stickers/Coins).
- **Actions**:
    - "Review Words" (See list of incorrect items).
    - "Play Again".
    - "Next Game" (or Back to Menu).

## 4. Other Screens
- **Videos**: List of video lessons grouped by topic. Player includes a simple quiz overlay.
- **Ranking**: Weekly and All-time leaderboards.
- **Profile**: Avatar customization, detailed stats.
