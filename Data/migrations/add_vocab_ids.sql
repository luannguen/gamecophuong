-- Run this in your Supabase SQL Editor to enable Vocabulary saving
ALTER TABLE "public"."lesson_versions" 
ADD COLUMN "vocab_ids" text[] DEFAULT '{}';

-- Optional: Comment/Description
COMMENT ON COLUMN "public"."lesson_versions"."vocab_ids" IS 'Array of Vocabulary IDs linked to this lesson version';
