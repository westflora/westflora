-- West Flora Contact Messages Schema
-- Run this separately in your Supabase SQL Editor
-- Stores messages submitted from the Contact page

CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Public insert contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Admin panel can read messages (anon key + password-protected /admin)
CREATE POLICY "Public read contact messages"
  ON contact_messages
  FOR SELECT
  USING (true);

-- Admin can update status (new / read / replied / archived)
CREATE POLICY "Public update contact messages"
  ON contact_messages
  FOR UPDATE
  USING (true);

-- Admin can delete messages
CREATE POLICY "Public delete contact messages"
  ON contact_messages
  FOR DELETE
  USING (true);
