import { memo } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useStoreData, INITIAL_FOOTER, FooterSettings } from "@/lib/storage";

const DASHBOARD_FOOTER_LINKS = {
  "Quick Navigation": [
    { label: "Home Page", href: "/" },
    { label: "Tour Packages", href: "/packages" },
    { label: "Special Flights", href: "/flights" },
    { label: "Luxury Hotels", href: "/hotels" },
    { label: "Media Gallery", href: "/gallery" },
  ],
  "Travel Services": [
    { label: "Book a Trip", href: "/booking" },
    { label: "Contact Us", href: "/contact" },
    { label: "VIP Umrah & Pilgrimage", href: "/packages" },
    { label: "Corporate Desk", href: "/contact" },
    { label: "Visa Assistance", href: "/contact" },
  ],

};

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

export const Footer = memo(function Footer() {
  const [footer] = useStoreData<FooterSettings>("footer", INITIAL_FOOTER);

  const socialPlatforms = [
    { icon: InstagramIcon, href: footer.instagram || SITE_CONFIG.social.instagram, label: "Instagram" },
    { icon: FacebookIcon, href: footer.facebook || SITE_CONFIG.social.facebook, label: "Facebook" },
    { icon: TwitterIcon, href: footer.twitter || SITE_CONFIG.social.twitter, label: "Twitter" },
    { icon: YoutubeIcon, href: footer.youtube || SITE_CONFIG.social.youtube, label: "YouTube" },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/60 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(245, 158, 11, 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Banner */}
        <div className="py-8 md:py-12 border-b border-slate-800/60">
          <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {footer.newsletterHeading || "Get inspired. Travel smarter."}
              </h2>
              <p className="text-slate-400 mt-1.5 text-xs sm:text-sm">
                {footer.newsletterSubtitle || "Weekly destination picks, travel tips & exclusive deals — straight to your inbox."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                id="newsletter-email"
                className="w-full sm:w-64 h-11 bg-slate-900 border border-slate-700 rounded-xl px-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              <Button variant="amber" size="md" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight size={15} />}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-12 md:py-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-12">
          {/* Brand Info & Socials (Spans 2 columns on all viewports) */}
          <div className="col-span-2 lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-block group">
              <Logo size="lg" />
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {footer.brandDescription || SITE_CONFIG.description}
            </p>

            {/* Contact details */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
              <a
                href={`mailto:${footer.email || SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors group"
              >
                <Mail size={14} className="text-amber-500/70 shrink-0" />
                <span className="truncate">{footer.email || SITE_CONFIG.contact.email}</span>
              </a>
              <a
                href={`tel:${footer.phone || SITE_CONFIG.contact.phone}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors group"
              >
                <Phone size={14} className="text-amber-500/70 shrink-0" />
                <span>{footer.phone || SITE_CONFIG.contact.phone}</span>
              </a>
              <span className="sm:col-span-2 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                <MapPin size={14} className="text-amber-500/70 shrink-0" />
                <span className="leading-snug">{footer.address || SITE_CONFIG.contact.address}</span>
              </span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Connect With Us</span>
              <div className="flex items-center gap-2.5">
                {socialPlatforms.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/50 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all duration-200 shadow-sm"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links Columns */}
          {Object.entries(DASHBOARD_FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="space-y-3 col-span-1">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="text-amber-500/40 group-hover:text-amber-400 transition-colors text-xs">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500">
            {footer.copyrightText || `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>Crafted with ✦ for dreamers & explorers</span>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-amber-400 transition-colors underline decoration-slate-700 underline-offset-4 font-medium"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
