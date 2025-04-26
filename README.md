# Caravan Trip Plan

## Trip Logic Implementation

This project implements a comprehensive trip planning system for multiple destination itineraries. The system allows users to select a destination, number of nights, and starting date to generate a customized trip plan based on predefined itinerary patterns.

### Key Features

- Trip pattern mapping based on number of nights for different destinations
- Dynamic date calculation for each stop in the itinerary
- Live availability checking for accommodations at each stop
- Backend endpoint for generating complete trip plans
- Frontend context provider to manage trip planning state

### How the Trip Logic Works

1. **Home Page**: User selects the number of nights and start date
2. **Destination Page**: User selects the desired destination (e.g., Northern Michigan)
3. **Trip Logic Mapping**: The system uses the predetermined itinerary mapping (as shown in the screenshot) to build a trip plan
4. **Dynamic Dates**: Based on the start date and itinerary, dates for each stop are calculated
5. **Live Availability**: For each stop in the itinerary, the system fetches live availability data using the appropriate scrapers for that location

### Example

For a 5-night Northern Michigan trip starting on June 11:

- The system will generate an itinerary with:
  - Traverse City: June 11-13 (2 nights)
  - Mackinac City: June 13-14 (1 night)
  - Pictured Rocks: June 14-16 (2 nights)
- For each stop, the appropriate scrapers are called with the specific date ranges

### Implementation Details

#### Trip Itinerary Data Structure

```typescript
// In frontend/src/data/tripItineraries.ts
const northernMichiganStops: Record<number, TripStop[]> = {
	1: [{ city: "Traverse City", nights: 1 }],
	2: [{ city: "Traverse City", nights: 2 }],
	3: [
		{ city: "Traverse City", nights: 2 },
		{ city: "Mackinac", nights: 1 },
	],
	// ... additional patterns for more nights
};
```

#### Backend Trip Plan Endpoint

```python
# In backend/app.py
@app.route('/api/trip-plan', methods=['POST'])
def generate_trip_plan():
    # Gets destination, nights, and start date
    # Retrieves the appropriate itinerary pattern
    # Calculates dates for each stop
    # Fetches availability for each campground at each stop
    # Returns a complete trip plan with availability data
```

#### Frontend Trip Context

```typescript
// In frontend/src/context/TripPlanContext.tsx
export const TripPlanProvider: React.FC = ({ children }) => {
	const [tripPlan, setTripPlan] = useState<ItineraryPlan | null>(null);
	const [availabilityData, setAvailabilityData] = useState<any[] | null>(null);

	const generatePlan = async (
		destinationId,
		nights,
		startDate,
		numAdults,
		numKids
	) => {
		// Calls the backend API to generate a trip plan
		// Updates the context with the result
	};

	// ... additional context features
};
```

### Extending to Other Destinations

To add trip patterns for other destinations:

1. Define the trip patterns in `TRIP_ITINERARIES` (backend) and `tripItineraries.ts` (frontend)
2. Create scrapers for the new destinations
3. Add the new destinations to the available options

## Setup and Development

### Prerequisites

- Node.js 14+ and npm
- Python 3.7+
- Flask

### Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/
│   ├── app.py            # Main Flask application
│   ├── scrapers/         # Scraper modules for each destination
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # Context providers
    │   ├── data/         # Trip itinerary data
    │   ├── pages/        # Page components
    │   ├── services/     # API service modules
    │   ├── utils/        # Utility functions
    │   └── types.ts      # TypeScript type definitions
    └── package.json      # Node dependencies and scripts
```

## Deploying to Vercel

This project is configured for easy deployment on Vercel:

1. Fork or clone this repository to your GitHub account
2. Connect your GitHub repository to Vercel
3. Configure the following environment variables in the Vercel dashboard:
   - `BACKEND_API_URL`: URL to your backend API (e.g., https://your-backend-api.com/api)
   - `VITE_MAPBOX_TOKEN`: Your Mapbox API token
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key

Note: The backend is not included in the Vercel deployment. You'll need to deploy the backend separately.
