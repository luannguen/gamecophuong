# Student Game Flow Refactor Specification

## 1. Goal
Implement the strict flow: `Topic Detail -> Minigame Selection -> Intro -> Gameplay`.

## 2. Screens

### 2.1 Topic Detail / Minigame Selection (`/student/topic/:id`)
*Replaces the previous generic game list.*

- **Layout**:
    - **Hero Section**: Large Theme Image (from `image_url`), Topic Title, Progress Bar (Overall Topic Mastery).
    - **Game Grid**: List available Game Types enabled for this topic.
- **Game Card**:
    - Icon (Listening/Speaking etc.)
    - Title (e.g., "Vocabulary Match")
    - **Status**: Locked (Padlock) vs Unlocked (Play Button).
    - **Score**: Best star rating shown designated by small stars.
- **Navigation**: Back button to Topic List.

### 2.2 Game Intro Overlay
*Modal or Interstitial Screen before gameplay.*

- **Trigger**: User clicks a Game Card.
- **Content**:
    - Large Game Icon.
    - Title: "Listen & Tap".
    - Instructions: "Listen to the sound and pick the right picture!" (with TTS audio).
    - **Button**: "START" (Pulse animation).
- **Background**: Blurred version of the Game UI or Theme Image.

## 3. Gameplay Routing
- Based on Game Type selected, route to:
    - `/student/game/sub/listen-tap`
    - `/student/game/sub/listen-choose`
    - `/student/game/sub/speaking`
    - etc.
- **Context**: Pass `topicId` to the game component to fetch relevant vocabulary.

## 4. Implementation Steps
1.  **Route**: Update `App.jsx` to direct `/student/topic/:id` to `TopicDetailPage`.
2.  **Component**: Build `TopicDetailPage` fetching Topic + its Games.
3.  **Component**: Build `GameIntroModal`.
4.  **Integration**: Link "Start" button to the specific Game Route.
