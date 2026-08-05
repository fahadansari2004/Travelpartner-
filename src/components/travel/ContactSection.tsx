"use client";

import { useState } from "react";
import { MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const OFFICES = [
  { city: "New York HQ", address: "555 Fifth Avenue, Suite 2400, NY", phone: "+1 (800) 555-0199" },
  { city: "London Lounge", address: "14 Mayfair Square, London W1J 6BQ", phone: "+44 20 7946 0912" },
  { city: "Tokyo Hub", address: "Roppongi Hills Mori Tower 32F, Tokyo", phone: "+81 3 5555 0143" },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    destination: "Bali, Indonesia",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Section background="slate-900" padding="xl" borderTop glow="amber">
      <SectionHeader
        align="between"
        eyebrow={<Badge variant="amber" size="lg">✦ Connect With Us</Badge>}
        title={<>Start Your <span className="gradient-text">Expedition</span></>}
        subtitle="Speak with our master travel architects to curate your bespoke global journey."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Info & Global Offices */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Global Concierge Offices
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our 24/7 dedicated travel concierge desks operate across major financial &amp; cultural hubs worldwide.
            </p>

            <div className="space-y-4 pt-2">
              {OFFICES.map((office) => (
                <div
                  key={office.city}
                  className="glass p-4 rounded-2xl border border-slate-800/80 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <h4 className="text-base font-bold text-white font-[family-name:var(--font-playfair)]">
                      {office.city}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin size={12} className="text-amber-400 shrink-0" />
                    {office.address}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-amber-400 shrink-0" />
                    {office.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Inquiry Received!
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. A master travel architect will review your itinerary request and contact you within 2 hours.
                </p>
                <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
                  Request a Private Consultation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    placeholder="Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Preferred Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full h-12 bg-slate-900/80 border border-slate-800 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="Santorini, Greece">Santorini, Greece</option>
                    <option value="Kyoto, Japan">Kyoto, Japan</option>
                    <option value="Swiss Alps">Swiss Alps, Switzerland</option>
                    <option value="Maldives">Maldives Overwater Resort</option>
                    <option value="Custom Itinerary">Tailor-Made Custom Expedition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Travel Wishes &amp; Preferences
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your dates, party size, special occasions, or desired experiences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <Button
                  variant="amber"
                  size="lg"
                  fullWidth
                  type="submit"
                  rightIcon={<Send size={16} />}
                >
                  Submit Expedition Request
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
