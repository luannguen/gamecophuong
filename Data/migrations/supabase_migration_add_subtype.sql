-- Add subtype column to mini_games table to distinguish between specific game mechanics
-- e.g. type='listening', subtype='listening_tap' vs 'listening_word'

ALTER TABLE mini_games 
ADD COLUMN subtype text DEFAULT 'default';

COMMENT ON COLUMN mini_games.subtype IS 'Specific game mechanic identifier (e.g., listening_tap, listening_word)';
