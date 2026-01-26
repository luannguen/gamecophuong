-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  admin_id uuid,
  action_type character varying NOT NULL,
  action_description text,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT activity_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  auth_user_id uuid NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role character varying DEFAULT 'admin'::character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  icon_url text,
  color_code character varying,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  icon text,
  image_url text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.challenge_participants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  challenge_id uuid,
  student_id uuid,
  status character varying DEFAULT 'participating'::character varying,
  current_score integer DEFAULT 0,
  joined_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT challenge_participants_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_participants_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id),
  CONSTRAINT challenge_participants_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  challenge_type character varying,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  reward_points integer DEFAULT 0,
  reward_badge_url text,
  min_score_required integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.checkpoints (
  id character varying NOT NULL,
  lesson_version_id character varying,
  time_sec integer NOT NULL,
  type character varying NOT NULL,
  vocab_id uuid,
  content jsonb,
  CONSTRAINT checkpoints_pkey PRIMARY KEY (id),
  CONSTRAINT checkpoints_lesson_version_id_fkey FOREIGN KEY (lesson_version_id) REFERENCES public.lesson_versions(id),
  CONSTRAINT checkpoints_vocab_id_fkey FOREIGN KEY (vocab_id) REFERENCES public.vocabulary(id)
);
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  teacher_id uuid,
  academic_year character varying,
  grade_level integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT classes_pkey PRIMARY KEY (id),
  CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.game_answers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid,
  vocabulary_id uuid,
  question_text text,
  student_answer text,
  correct_answer text,
  is_correct boolean NOT NULL,
  time_spent_seconds integer DEFAULT 0,
  answered_at timestamp with time zone DEFAULT now(),
  CONSTRAINT game_answers_pkey PRIMARY KEY (id),
  CONSTRAINT game_answers_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id),
  CONSTRAINT game_answers_vocabulary_id_fkey FOREIGN KEY (vocabulary_id) REFERENCES public.vocabulary(id)
);
CREATE TABLE public.game_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  game_id uuid,
  category_id uuid,
  start_time timestamp with time zone DEFAULT now(),
  end_time timestamp with time zone,
  status character varying DEFAULT 'in_progress'::character varying,
  total_questions integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  score integer DEFAULT 0,
  stars_earned integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT game_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT game_sessions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT game_sessions_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.mini_games(id),
  CONSTRAINT game_sessions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.lesson_versions (
  id character varying NOT NULL,
  lesson_id character varying,
  version_number integer NOT NULL,
  status character varying DEFAULT 'draft'::character varying,
  video_source character varying DEFAULT 'youtube'::character varying,
  video_url text,
  duration_sec integer,
  difficulty integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lesson_versions_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_versions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.lessons (
  id character varying NOT NULL,
  unit_id character varying,
  title character varying NOT NULL,
  description text,
  order integer DEFAULT 0,
  current_version_id character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id)
);
CREATE TABLE public.mini_games (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  game_type character varying NOT NULL,
  skill_focus character varying NOT NULL,
  description text,
  thumbnail_url text,
  max_stars integer DEFAULT 3,
  time_limit_seconds integer,
  min_score_for_3_stars integer DEFAULT 900,
  min_score_for_2_stars integer DEFAULT 700,
  min_score_for_1_star integer DEFAULT 500,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  subtype text DEFAULT 'default'::text,
  CONSTRAINT mini_games_pkey PRIMARY KEY (id)
);
CREATE TABLE public.parent_students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  parent_id uuid,
  student_id uuid,
  relationship character varying DEFAULT 'parent'::character varying,
  is_primary_contact boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT parent_students_pkey PRIMARY KEY (id),
  CONSTRAINT parent_students_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id),
  CONSTRAINT parent_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.parents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  auth_user_id uuid NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  phone_number character varying,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT parents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  description text,
  resource character varying NOT NULL,
  action character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  description text,
  is_system boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.scores (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  game_id uuid,
  category_id uuid,
  score integer NOT NULL,
  stars integer DEFAULT 0,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT scores_pkey PRIMARY KEY (id),
  CONSTRAINT scores_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT scores_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.mini_games(id),
  CONSTRAINT scores_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  display_name character varying NOT NULL,
  avatar_url text,
  pin_code character varying NOT NULL UNIQUE,
  qr_code character varying NOT NULL UNIQUE,
  auth_user_id uuid,
  total_score integer DEFAULT 0,
  total_stars integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  teacher_id uuid,
  class_id uuid,
  gender text DEFAULT 'male'::text,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  auth_user_id uuid NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  phone_number character varying,
  school_name character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  CONSTRAINT teachers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.units (
  id character varying NOT NULL,
  title character varying NOT NULL,
  description text,
  order integer DEFAULT 0,
  status character varying DEFAULT 'draft'::character varying,
  category_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT units_pkey PRIMARY KEY (id),
  CONSTRAINT fk_units_category FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid,
  title character varying NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  category text DEFAULT 'General'::text,
  duration text,
  level text CHECK (level = ANY (ARRAY['Beginner'::text, 'Intermediate'::text, 'Advanced'::text])),
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT videos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.vocabulary (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid,
  word character varying NOT NULL,
  meaning character varying NOT NULL,
  pronunciation character varying,
  image_url text,
  audio_url text,
  difficulty_level character varying DEFAULT 'beginner'::character varying,
  usage_example text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vocabulary_pkey PRIMARY KEY (id),
  CONSTRAINT vocabulary_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.weekly_rankings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  student_id uuid,
  total_score integer DEFAULT 0,
  total_stars integer DEFAULT 0,
  games_played integer DEFAULT 0,
  rank integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT weekly_rankings_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_rankings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
