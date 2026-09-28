import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Memories & Photo Gallery | TravelPartner",
  description:
    "Immerse yourself in breathtaking destinations, client expeditions, and visual travel diaries curated by TravelPartner.",
  alternates: {
    canonical: "https://travelpartnerktm.in/gallery",
  },
  openGraph: {
    title: "Travel Memories & Photo Gallery | TravelPartner",
    description:
      "Explore curated travel albums, client expeditions, and exotic landscapes with TravelPartner.",
    url: "https://travelpartnerktm.in/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
