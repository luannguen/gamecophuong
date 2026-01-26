# Task: Make Difficulty & Vocabulary Persistent

## Analysis
- **Problem 1: Difficulty Resets**
    - **Cause**: Data binding is one-way. We save Int (1-4) to DB, but load nothing back. `useWatchAndLearn` creates the `lesson` object without `difficultyLevel` property. `LessonMetadataSidebar` defaults standard value if missing.
    - **Fix**: In `useWatchAndLearn`, map `version.difficulty` (int) -> `lesson.difficultyLevel` (string).

- **Problem 2: Vocabulary Not Saving**
    - **Cause**: `handleSave` has a `console.warn` placeholder. `useWatchAndLearn` doesn't load `vocab_ids`.
    - **Fix**:
        1.  **Load**: In `useWatchAndLearn`, pass `vocab_ids` from version to lesson.
        2.  **Hydrate**: In `LessonEditor`, map `lesson.vocab_ids` + `allVocabulary` -> `currentLesson.target_vocabulary`.
        3.  **Save**: In `LessonEditor.handleSave`, map `currentLesson.target_vocabulary` -> `vocab_ids` array and send to `updateLessonVersion`.

## Execution Plan
1. [x] **Update `useWatchAndLearn.js`**:
    - Add `difficulty` -> `difficultyLevel` mapping helper.
    - Pass `vocab_ids` property from version.
    - Update `updateLessonVersion` to accept `vocab_ids`.
2. [x] **Update `LessonEditor.jsx`**:
    - In `useEffect`, logic to hydrate `target_vocabulary` from `lesson.vocab_ids` and `vocabulary` context.
    - In `handleSave`, extract IDs and send `vocab_ids` in updates.
3. [x] **Verify**: Full cycle test (Edit -> Save -> Refresh -> Check persistence).
