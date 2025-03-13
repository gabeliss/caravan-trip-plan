Tech Stack:

- NextJS with App router
- Typescript
- TailwindCSS
- ShadCN
- Supabase (for db, storage, authentication)

Color scheme:
:root {
--primary-color: #3E624F; (main text color)
--primary-color-dark: #1a3629;
--primary-color-light: #6a9c7f;
--secondary-color: #F7EAD6; (main background color)
--secondary-color-light: #ece9e6;
--orange-color: #DC7644;
--text-light: white;
--text-dark: black;
--charcoal-gray: #423E3E;
--midnight-blue: #7A8F97;
--brown-color: #5B5943;
}

Header and Footer Logo: src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images/header/CaravanTripPlan.png"

I am looking to build a campground directory website. The idea of the website is that if someone looks up
"Northern Michigan roadtrip" or "northern michigan campgrounds", our website will help them find personally vetted campgrounds and plan their dream roadtrip.

The header will be shown on every page and allow users to navigate back to home, navigate to different trip pages, as well as an FAQ page.

The landing page should be beautifully designed and encourage users to check out our trip pages and plan their dream camping trip. Play on human emotions by making it appeal to families, and getting closer with friends. Perhaps they should also be able to navigate to trip pages from the landing page.

For the trip pages, lets start with 5 of them: Northern Michigan, Washington, Arizona, Smoky Mountains, and Southern California. For each trip, we will want to show different campgrounds for each location in the trip. For example for the Northern Michigan trip, there will be 3 locations: Traverse City, Mackinac City, and Pictured Rocks. For each of these locations, we will want to display campgrounds in a Card format. Perhaps we will show some initial important data and ability to slide through images at first, but if users click into a campground they can get the rest of the info. It should not be a separate page, but maybe the Card expands or brings up a modal.

Use the sample data in data.json to get an idea of what data we will show. Right now the lodging is empty but we will want each trip to offer tent options, lodging options, or if the user wants to see all options then we will show both.

The campground data should probably be stored in a database for scalability purposes. Even though data.json only provides Northern Michigan, please make up fake campground data for northern michigan lodging, as well as all the other trips and we will replace it with real campgrounds either.

For each trip, we will want to show information such as recommended route, favorite restaurants, activites, hikes in each place, and we will eventually want to offer custom trip itineraries.

Please make sure the code is as modular and maintainable as possible. Create reusable components and utility functions whererever possible. Design all pages to be responsive for all screen sizes, with a mobile first design.
