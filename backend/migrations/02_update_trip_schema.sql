ALTER TABLE trips DROP COLUMN tripdetails,
    ADD COLUMN trip_details JSONB NOT NULL;
-- Update the constraints to ensure trip_details has the required fields
ALTER TABLE trips
ADD CONSTRAINT trips_trip_details_check CHECK (
        trip_details ? 'destination'
        AND trip_details ? 'nights'
        AND trip_details ? 'startDate'
        AND trip_details ? 'guestCount'
    );
-- Add a comment to indicate the purpose of this column
COMMENT ON COLUMN trips.trip_details IS 'Consolidated trip information including destination, nights, startDate, and guestCount';
-- TODO: Update the campgrounds column schema to require city information
-- (This part is missing or incomplete in your script)