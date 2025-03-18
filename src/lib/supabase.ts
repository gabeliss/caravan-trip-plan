import { createClient } from '@supabase/supabase-js';

// This file sets up the Supabase client with environment variables
// These must be set in your Vercel project settings as well

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create a single supabase client for the entire app
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Create a typed client (can be enhanced later with your database types)
export type Database = {
  // Add your database types here when ready
}

export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>; 