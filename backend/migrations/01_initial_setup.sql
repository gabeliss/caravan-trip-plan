-- Users table (complementing Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS (Row Level Security) on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Policy to allow users to see only their own data
CREATE POLICY "Users can view their own data" ON users FOR
SELECT USING (auth.uid() = id);
-- Policy to allow users to update their own data
CREATE POLICY "Users can update their own data" ON users FOR
UPDATE USING (auth.uid() = id);
-- Policy to allow new user inserts during registration
CREATE POLICY "Allow inserts for new users" ON users FOR
INSERT WITH CHECK (true);
-- This allows all inserts, but our trigger logic controls this
-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    confirmation_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    destination JSONB NOT NULL,
    duration JSONB NOT NULL,
    campgrounds JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('planned', 'active', 'completed')),
    guide_url TEXT
);
-- Enable RLS on trips table
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
-- Policy to allow users to see only their own trips
CREATE POLICY "Users can view their own trips" ON trips FOR
SELECT USING (auth.uid() = user_id);
-- Policy to allow users to insert new trips that belong to them
CREATE POLICY "Users can insert their own trips" ON trips FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Policy to allow users to update their own trips
CREATE POLICY "Users can update their own trips" ON trips FOR
UPDATE USING (auth.uid() = user_id);
-- Policy to allow users to delete their own trips
CREATE POLICY "Users can delete their own trips" ON trips FOR DELETE USING (auth.uid() = user_id);
-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.users (id, email, name, created_at)
VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', 'User'),
        -- Default to 'User' if name is not provided
        NOW()
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();