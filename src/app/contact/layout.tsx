import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Concierge & Booking Office | TravelPartner Kottayam",
  description:
    "Get in touch with TravelPartner Tours and Travels in Kottayam, Kerala. WhatsApp concierge, custom itinerary requests, and 24/7 client support.",
  alternates: {
    canonical: "https://travelpartnerktm.in/contact",
  },
  openGraph: {
    title: "Contact TravelPartner Tours & Travels | Kottayam",
    description:
      "Direct line to VIP travel specialists for personalized bookings, visa inquiries, and honeymoon planning.",
    url: "https://travelpartnerktm.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
