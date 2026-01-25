-- Create mini_games table linked to video_categories (topics)
create table if not exists mini_games (
  id uuid default gen_random_uuid() primary key,
  title text not null,               -- e.g. "Elephant"
  subtitle text,                     -- e.g. "Trumpet Sound"
  type text not null,                -- e.g. "listening", "speaking", "vocabulary", "puzzle"
  topic_id uuid references video_categories(id) on delete cascade,
  star_reward integer default 10,    -- e.g. 150 stars
  
  -- Media/Content
  image_url text,                    -- Thumbnail or Main Image
  audio_url text,                    -- For listening games
  correct_answer text,               -- For validation
  
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table mini_games enable row level security;

-- Policies
create policy "Public games are viewable by everyone."
  on mini_games for select
  using ( is_active = true );

create policy "Authenticated users can insert games."
  on mini_games for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update games."
  on mini_games for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can delete games."
  on mini_games for delete
  using ( auth.role() = 'authenticated' );
