import type { Metadata, Viewport } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "TravelPartner | Tours & Travels | Best Travel Agency in Kottayam, Kerala",
    template: `%s | TravelPartner`,
  },
  description: SITE_CONFIG.description,
  applicationName: "TravelPartner",
  keywords: [
    "Travelpartner",
    "Travel partner",
    "Travelpartner KTM",
    "TravelPartner Tours and Travels",
    "travelpartnerktm.in",
    "travel agency kottayam",
    "kerala travel agency",
    "holiday tour packages",
    "international flight booking",
    "best travel agency in kerala",
    "luxury vacations kottayam",
  ],
  authors: [{ name: "TravelPartner", url: SITE_CONFIG.url }],
  creator: "TravelPartner Tours and Travels",
  publisher: "TravelPartner",
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    title: "TravelPartner | Tours & Travels | Kottayam, Kerala",
    description: SITE_CONFIG.description,
    siteName: "TravelPartner",
    images: [
      {
        url: "/images/og-luxury.jpg",
        width: 1200,
        height: 630,
        alt: "TravelPartner Tours and Travels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelPartner | Tours & Travels",
    description: SITE_CONFIG.description,
    images: ["/images/og-luxury.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#020617" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TravelAgency", "LocalBusiness"],
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: "TravelPartner Tours and Travels",
        alternateName: [
          "Travelpartner",
          "Travel Partner",
          "TravelPartner KTM",
          "travelpartnerktm.in",
          "TravelPartner Tours & Travels",
        ],
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/icon.png`,
        image: `${SITE_CONFIG.url}/images/og-luxury.jpg`,
        telephone: SITE_CONFIG.contact.phone,
        email: SITE_CONFIG.contact.email,
        priceRange: "₹₹₹",
        openingHours: "Mo-Sa 09:00-20:00",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Central Junction",
          addressLocality: "Kottayam",
          addressRegion: "Kerala",
          postalCode: "686001",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 9.5916,
          longitude: 76.5222,
        },
        sameAs: [
          SITE_CONFIG.social.instagram,
          SITE_CONFIG.social.facebook,
          SITE_CONFIG.social.twitter,
          SITE_CONFIG.social.youtube,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: "TravelPartner",
        alternateName: ["Travelpartner", "Travel Partner", "TravelPartner KTM"],
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_CONFIG.url}/packages?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph),
          }}
        />
        <link rel="preconnect" href="https://ciixxtmneichewgjujbe.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className="font-sans bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden"
      >
        <LenisProvider>
          {children}
          <WhatsAppButton />
        </LenisProvider>
      </body>
    </html>
  );
}
