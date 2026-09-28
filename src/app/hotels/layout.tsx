import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Hotels & 5-Star Resorts | TravelPartner",
  description:
    "Discover world-class resorts, boutique heritage hotels, and luxury suites vetted by TravelPartner Tours and Travels.",
  alternates: {
    canonical: "/hotels",
  },
  openGraph: {
    title: "Luxury Hotels & Boutique Stays | TravelPartner",
    description:
      "Handpicked 5-star properties, private villas, and serene retreats worldwide.",
    url: "/hotels",
  },
};

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
