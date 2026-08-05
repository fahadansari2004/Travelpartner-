import type { Metadata, Viewport } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "travel agency",
    "luxury expeditions",
    "cinematic scroll",
    "curated itineraries",
    "wanderlust horizon",
    "vacation booking",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Wanderlust Horizon",
              description:
                "Curated luxury expeditions, bespoke itineraries, and cinematic travel storytelling.",
              url: "https://wanderlust-horizon.com",
              telephone: "+1-800-555-0199",
              address: {
                "@type": "PostalAddress",
                streetAddress: "555 Fifth Avenue, Suite 2400",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10017",
                addressCountry: "US",
              },
            }),
          }}
        />
      </head>
      <body
        className="font-sans bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden"
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
