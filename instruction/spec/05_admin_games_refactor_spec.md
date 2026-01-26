# Admin Games Refactor Specification

## 1. Goal
Shift the Admin Game Manager from a linear list of games to a **Topic-Centric Configuration Console**. Admin should select a topic and then "enable/configure" the standard game types (A-F) for that topic.

## 2. New UI Structure (`/admin/games`)

### 2.1 Layout
- **Left Sidebar (25%)**: List of Topics (Categories).
    - Search bar at top.
    - Each item shows Icon + Name + Active Games Count.
    - Selected item highlighted.
- **Main Area (75%)**: Game Configurations for Selected Topic.

### 2.2 Main Area (Topic Configuration)
- **Header**: Topic Title + "Theme Image" Preview + "Edit Topic" shortcut.
- **Game Type Grid**: 6 Cards representing the 6 Game Types (A-F).
    - **Card State**:
        - **Disabled**: Greyed out, "Enable" button.
        - **Enabled**: Colored (e.g., Listening = Blue), "Configure" button, Toggle Switch to disable.
    - **Card Content**: Icon, Name (e.g., "Listen & Tap"), Status (Active/Inactive).

### 2.3 Configuration Modals (per Game Type)
When clicking "Configure" on a Game Type:

#### Type A & B (Listening)
- **Source**: Select Vocabulary from this Topic.
- **Config**:
    - "Select All Words" or manual selection.
    - Difficulty settings (e.g., Number of choices).

#### Type C (Speaking)
- **Source**: Select Vocabulary.
- **Config**: Passing Grade (e.g., 80%).

#### Type D & E (Matching / Sentence)
- **Input**: Manual entry or drag-and-drop builder (Future phase).
- **MVP**: Upload JSON or Simple Text Pair input.

#### Type F (Hide & Seek)
- **Image**: Upload Background Scene.
- **Hotspots**: Define X/Y coordinates for each vocabulary item (Advanced).
- **MVP**: Just list items to find (random position or text-only if no coord system yet).

## 3. Data Model Changes
- **Current**: `games` table with `topic_id`, `type`.
- **New Approach**:
    - `topic_game_config` table (One row per Topic + GameType).
    - Fields: `is_enabled`, `config_json`, `custom_title`.
    - This allows one "Listen & Tap" instance per Topic without creating loose "Game" records.

## 4. Implementation Steps
1.  **DB**: Create `topic_game_config` table (if simplifying) OR stick to `games` table but enforce 1 record per type per topic.
    - *Decision*: Stick to `games` table for compatibility, but Admin UI enforces "One of each type".
2.  **UI**: Split screen layout (Topics | Games).
3.  **Components**: `TopicSidebar`, `GameTypeCard`, `GameConfigModal`.
