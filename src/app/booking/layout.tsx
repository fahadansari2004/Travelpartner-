import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Bespoke Tours & Expeditions | TravelPartner",
  description:
    "Design and reserve your personalized holiday package or VIP tour with TravelPartner Tours and Travels.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Book Bespoke Tours & Expeditions | TravelPartner",
    description:
      "Seamless reservation experience with instant confirmation and tailored travel itineraries.",
    url: "/booking",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
