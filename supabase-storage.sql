-- West Flora product image storage (required for Vercel / serverless)
-- Run this in Supabase SQL Editor if uploads fail with "bucket missing"

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  8388608,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Allow product image upload" on storage.objects;
drop policy if exists "Allow product image update" on storage.objects;
drop policy if exists "Allow product image delete" on storage.objects;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Allow product image upload"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Allow product image update"
  on storage.objects for update
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "Allow product image delete"
  on storage.objects for delete
  using (bucket_id = 'product-images');
