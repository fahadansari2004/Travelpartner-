import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tour Packages & Holiday Itineraries | TravelPartner",
  description:
    "Explore curated holiday packages and domestic & international tour itineraries from TravelPartner Tours and Travels in Kottayam, Kerala.",
  alternates: {
    canonical: "https://travelpartnerktm.in/packages",
  },
  openGraph: {
    title: "Tour Packages & Vacation Trips | TravelPartner",
    description:
      "Book handpicked travel packages with 24/7 concierge support, luxury stays, and guided expeditions.",
    url: "https://travelpartnerktm.in/packages",
  },
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
