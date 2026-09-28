import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Bookings & Air Tickets | TravelPartner",
  description:
    "Book domestic and international flights at the best rates with TravelPartner Tours and Travels. First class, business class, and economy ticketing.",
  alternates: {
    canonical: "https://travelpartnerktm.in/flights",
  },
  openGraph: {
    title: "Flight Bookings & Airline Tickets | TravelPartner",
    description:
      "Exclusive airline deals, instant seat inquiry, and premium flight ticketing with TravelPartner.",
    url: "https://travelpartnerktm.in/flights",
  },
};

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
