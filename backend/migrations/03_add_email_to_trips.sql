-- Add email column to trips table
ALTER TABLE trips
ADD COLUMN email TEXT;
-- Update RLS policies to allow queries by email as well
CREATE OR REPLACE POLICY "Guests can view their trips via email" ON trips FOR
SELECT USING (
        (auth.uid() = user_id) -- Existing condition for authenticated users
        OR (
            auth.uid() IS NULL
            AND email IS NOT NULL
        ) -- Allow retrieval of guest trips by email
    );
-- Add comment to explain the purpose of the email column
COMMENT ON COLUMN trips.email IS 'Email address for guest users without accounts; used for trip confirmation and retrieval';