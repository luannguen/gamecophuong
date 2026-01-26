# Game Mechanics Specification

This document details the logic and UI for the 6 core game types.

## Common Rules
- **Feedback**: Instant visual (Green/Red border) + Audio (Ding/Buzz).
- **Scoring**: Base score per correct answer + Time Bonus + Streak Multiplier.

---

## Type A: Listening – "Listen & Tap"
**Goal**: Match audio to an image.
1.  **Gameplay**:
    - System plays audio (e.g., "Lion").
    - Display 4 cards (Image + Text).
    - User taps a card.
2.  **Logic**:
    - Correct: Play "Correct" sound -> Auto-advance after 1s.
    - Incorrect: Shake card, play "Wrong" sound -> Allow retry (reduced score).
3.  **Assets**: Audio files, Image per vocabulary.

## Type B: Listening – "Listen & Choose Word"
**Goal**: Identify the correct word form/spelling.
1.  **Gameplay**:
    - System plays audio.
    - Display 3-4 text chips (Buttons) with similar words (e.g., "Cat", "Bat", "Hat").
    - Minimal images to focus on text.
2.  **Logic**: Strictly checks word recognition.

## Type C: Speaking – "Pronunciation Coach"
**Goal**: Pronounce the word correctly.
1.  **Gameplay**:
    - Display Target Word + Image.
    - System says "Repeat after me... [Word]".
    - User taps "Mic" button -> Records audio.
2.  **Logic**:
    - Send audio to Speech-to-Text (STT) or Pronunciation API.
    - Compare result with target word.
    - **Feedback**:
        - > 80%: "Excellent!" (Green)
        - 50-80%: "Good job" (Yellow)
        - < 50%: "Try again" (Red)

## Type D: Drag & Drop – "Matching / Family Tree"
**Goal**: Categorization or Labeling.
1.  **Gameplay**:
    - **Canvas**: Background image with "Drop Zones" (e.g., Silhouettes of family members).
    - **Draggables**: Word chips at the bottom (Mother, Father).
2.  **Interaction**:
    - User drags chip to zone.
    - **Snap Logic**: If close to correct zone -> Snap into place. If wrong -> Return to bottom.
3.  **Review**: Show full completed map at end.

## Type E: Sentence Builder
**Goal**: Learn sentence structure.
1.  **Gameplay**:
    - Prompt: vietnamese meaning or Audio.
    - UI: Empty slots [ _ ] [ _ ] [ _ ].
    - Word Bank (Scrambled): [my] [brush] [teeth] [I].
2.  **Interaction**:
    - Drag words into slots.
    - Button: "Check Answer".
3.  **Logic**:
    - Order must be exact: "I brush my teeth".

## Type F: Hide & Seek (Vocabulary)
**Goal**: Find objects in a scene.
1.  **Gameplay**:
    - **Scene**: A rich illustration (e.g., Bedroom).
    - **Target List**: Bottom bar shows items to find (with counter `0/5`).
    - **Timer**: Ticking down.
2.  **Interaction**:
    - User pans/zooms (if needed) and taps objects in the scene.
    - **Correct Tap**: Object animates/glows + flies to the target bar.
    - **Wrong Tap**: X mark appears/time penalty.
3.  **Review**: Show all hidden items with their English names.
