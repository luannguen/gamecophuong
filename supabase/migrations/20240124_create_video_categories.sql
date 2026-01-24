-- Create video_categories table
create table if not exists video_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  icon text not null,        -- Material Symbol name (e.g. 'pets')
  color text not null,       -- Hex color (e.g. '#FF8CBE')
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table video_categories enable row level security;

-- Create policies (Public Read, Authenticated Write)
create policy "Public categories are viewable by everyone."
  on video_categories for select
  using ( true );

create policy "Users can insert their own categories."
  on video_categories for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own categories."
  on video_categories for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete their own categories."
  on video_categories for delete
  using ( auth.role() = 'authenticated' );

-- Seed Default Categories (from designAssets.js)
insert into video_categories (name, icon, color)
values 
  ('Routines', 'restaurant', '#26d9d9'),
  ('Animals', 'pets', '#FF8CBE'),
  ('Grammar', 'menu_book', '#FCCD2B'),
  ('Songs', 'music_note', '#60A5FA'),
  ('Family', 'family_history', '#A78BFA')
on conflict (name) do nothing;
