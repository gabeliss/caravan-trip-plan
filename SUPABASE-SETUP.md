# Supabase Setup for Caravan Trip Planner

This guide will help you set up Supabase for authentication and database storage for the Caravan Trip Planner application.

## 1. Create a Supabase Account

If you haven't already, create a free Supabase account at [https://supabase.com](https://supabase.com).

## 2. Create a New Project

1. Log in to the Supabase Dashboard
2. Click "New Project"
3. Give your project a name (e.g., "caravan-trip-planner")
4. Choose a secure database password
5. Select the region closest to your users
6. Click "Create new project"

## 3. Get Your API Keys

1. Once your project is created, go to the project dashboard
2. Navigate to Settings > API
3. Find your project URL (`https://xxxxxxxxxxxx.supabase.co`) and anon key
4. Add these to your `.env.local` file in the frontend directory:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 4. Set Up the Database Tables

You can set up the necessary database tables by running the SQL migration file:

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `backend/migrations/01_initial_setup.sql`
3. Paste it into a new SQL query in the SQL Editor
4. Run the SQL query

## 5. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Site URL", enter your frontend app URL (e.g., `http://localhost:5173` for development)
3. Enable "Email" provider under "Email Auth"
4. Disable "Email Confirmations" during development (optional)
5. Save changes

## 6. Enable Row Level Security (RLS)

The SQL script already sets up RLS policies, but verify that they are properly created:

1. Go to Database > Tables
2. Select each table (users, trips)
3. Go to the "Policies" tab
4. Ensure that the policies defined in the SQL script are present

## 7. Testing Your Setup

1. Run your frontend application
2. Test user registration and login
3. Create a trip and verify it's saved in the Supabase database
4. Log out and log back in to verify trip persistence

## Troubleshooting

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Verify your API URL and key in the `.env.local` file
3. Check the Supabase logs in the dashboard under "Database > Logs"
4. Ensure Row Level Security policies are properly set up
5. Verify that the table structures match the expected formats

## Next Steps

- Set up email verification for production
- Configure password reset functionality
- Add social auth providers (Google, Facebook, etc.)
- Set up Stripe payment integration
