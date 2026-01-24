-- 1. Create the 'avatars' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Policy: Public Access (allow everyone to view avatars)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- 3. Policy: Upload Access (allow authenticated users to upload)
drop policy if exists "Authenticated users can upload" on storage.objects;
create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'avatars' );

-- 4. Policy: Update Access (allow authenticated users to update)
drop policy if exists "Authenticated users can update" on storage.objects;
create policy "Authenticated users can update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'avatars' );

-- 5. Policy: Delete Access (allow authenticated users to delete)
drop policy if exists "Authenticated users can delete" on storage.objects;
create policy "Authenticated users can delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'avatars' );
