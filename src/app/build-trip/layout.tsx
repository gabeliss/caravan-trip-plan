export const metadata = {
  title: "Build Your Custom Trip | Caravan Trip Plan",
  description: "Create your perfect camping road trip by selecting your ideal destinations, trip length, and campgrounds from our curated collection.",
};

export default function BuildTripLayout({
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