"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { useStoreData, INITIAL_ENQUIRIES, INITIAL_CONTACT, EnquiryItem, ContactSettings } from "@/lib/storage";

export default function ContactPage() {
  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);
  const [contactInfo] = useStoreData<ContactSettings>("contact", INITIAL_CONTACT);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<EnquiryItem["type"]>("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEnquiry: EnquiryItem = {
      id: `enq-${Date.now()}`,
      name,
      email,
      phone,
      type,
      subject,
      message,
      date: new Date().toISOString(),
      status: "New",
    };

    const updated = [newEnquiry, ...(enquiries || [])];
    setEnquiries(updated);
    setSubmitted(true);

    // Direct HTTP post to Supabase PostgreSQL database
    try {
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "enquiries", value: updated }),
      });
    } catch (err) {
      console.warn("Direct contact post notice:", err);
    }

    // Format WhatsApp message & redirect to WhatsApp chat
    let rawWa = (contactInfo?.whatsappNumber || "9645185581").replace(/\D/g, "");
    if (!rawWa || rawWa.includes("7356")) rawWa = "9645185581";
    if (rawWa.length === 10) rawWa = `91${rawWa}`;

    const waText = `Hi travelPartner! 📩 *New Contact Enquiry*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📞 *Phone:* ${phone || "Not Provided"}\n📌 *Category:* ${type}\n📝 *Subject:* ${subject}\n💬 *Message:* ${message}`;
    const waUrl = `https://wa.me/${rawWa}?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 300);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} /> 24/7 VIP Concierge Desk
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
            Global Concierge & <span className="gradient-text">Contact Desk</span>
          </h1>

          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Our personal travel managers are at your service 24 hours a day to curate bespoke journeys.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/15 bg-slate-900/60 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">Send an Enquiry</h2>
            <p className="text-xs text-slate-400 mt-1">Fill out your travel preferences and our senior advisor will contact you within 2 hours.</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <ShieldCheck size={48} className="text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">Enquiry Stored & Connecting to WhatsApp...</h3>
              <p className="text-xs text-slate-300">Thank you, {name}! Your luxury travel request has been logged in our database and forwarded to WhatsApp Support (+91 9645185581).</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button 
                  variant="emerald" 
                  size="sm" 
                  leftIcon={<MessageCircle size={16} />}
                  onClick={() => {
                    let rawWa = (contactInfo?.whatsappNumber || "9645185581").replace(/\D/g, "");
                    if (!rawWa || rawWa.includes("7356")) rawWa = "9645185581";
                    if (rawWa.length === 10) rawWa = `91${rawWa}`;
                    const waText = `Hi travelPartner! 📩 *New Contact Enquiry*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📞 *Phone:* ${phone || "Not Provided"}\n📌 *Category:* ${type}\n📝 *Subject:* ${subject}\n💬 *Message:* ${message}`;
                    window.open(`https://wa.me/${rawWa}?text=${encodeURIComponent(waText)}`, "_blank");
                  }}
                >
                  Open WhatsApp Chat
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSubmitted(false)}>Send Another Enquiry</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Lord / Lady Traveler" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="vip@travelpartner.com" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+1 (800) 555-0199" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Enquiry Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="General">General Enquiry</option>
                    <option value="Package">Tour Package</option>
                    <option value="Flight">First Class Flight</option>
                    <option value="Hotel">Hotel & Villa</option>
                    <option value="Visa">Visa Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="e.g. 10-day Honeymoon in Switzerland & Maldives" 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-300 font-semibold mb-1">Travel Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Tell us about your ideal travel dates, budget & special preferences..." 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400" 
                />
              </div>

              <Button variant="amber" size="lg" fullWidth type="submit" leftIcon={<Send size={16} />}>
                Submit VIP Travel Request
              </Button>
            </form>
          )}
        </div>

        {/* Enhanced 24/7 VIP Concierge Card */}
        <div className="relative glass-card p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-amber-950/30 shadow-2xl space-y-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                    24/7 VIP Direct Concierge
                  </h3>
                  <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Always Online & Ready
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              For immediate assistance, customized flight itineraries, hotel upgrades, or urgent journey modifications, reach out to our dedicated concierge desk anytime.
            </p>

            {/* Direct Contact Links Grid */}
            <div className="space-y-4 pt-2">
              {/* Phone Direct */}
              <a
                href={`tel:${contactInfo.phone || "9645185581"}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Call Direct Hotline</span>
                  <span className="text-lg sm:text-xl font-bold text-amber-400 group-hover:underline">
                    {contactInfo.phone || "9645185581"}
                  </span>
                </div>
              </a>

              {/* WhatsApp Direct */}
              {(() => {
                const rawWa = (contactInfo.whatsappNumber || "9645185581").replace(/\D/g, "");
                const waNumber = rawWa.length === 10 ? `91${rawWa}` : (rawWa || "919645185581");
                const displayWa = waNumber.startsWith("91") && waNumber.length === 12 ? waNumber.slice(2) : waNumber;
                return (
                  <a
                    href={`https://wa.me/${waNumber}?text=Hello!%20I%20would%20like%20to%20enquire%20about%20travel%20packages.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all group active:scale-[0.99]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase font-semibold tracking-wider block">Instant WhatsApp Chat</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-400 group-hover:underline">
                        +91 {displayWa}
                      </span>
                    </div>
                  </a>
                );
              })()}

              {/* Email Direct */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Official Support Email</span>
                  <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white">
                    {contactInfo.email}
                  </span>
                </div>
              </a>

              {/* Address Details */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">Headquarters Address</span>
                  <span className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed block mt-0.5">
                    {contactInfo.address}
                  </span>
                  {contactInfo.openingHours && (
                    <span className="text-[11px] text-amber-400 font-medium block mt-1">
                      Desk Hours: {contactInfo.openingHours}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
