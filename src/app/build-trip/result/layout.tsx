export const metadata = {
  title: "Your Custom Trip | Caravan Trip Plan",
  description: "View your personalized camping road trip itinerary with selected destinations and campgrounds.",
};

export default function BuildTripResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  );
} 