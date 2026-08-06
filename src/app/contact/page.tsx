"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Clock } from "lucide-react";
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

    // Direct HTTP post to Supabase PostgreSQL
    try {
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "enquiries", value: updated }),
      });
    } catch (err) {
      console.warn("Direct contact post notice:", err);
    }
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
              <h3 className="text-xl font-bold text-white">Enquiry Received</h3>
              <p className="text-xs text-slate-300">Thank you, {name}! Your luxury travel request has been logged in our VIP concierge system.</p>
              <Button variant="amber" size="sm" onClick={() => setSubmitted(false)}>Send Another Enquiry</Button>
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

        {/* Global Concierge Desks */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Global Concierge Offices</h2>
            <p className="text-xs text-slate-400 mt-1">Direct hotlines and flagship headquarters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-white">New York Headquarters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">555 Fifth Avenue, Suite 2400<br />New York, NY 10017, USA</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-white">London Concierge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">10 Mayfair Square, 4th Floor<br />London W1J 8AJ, UK</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">24/7 VIP Hotline</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For urgent itinerary modifications, flight changes, or emergency assistance during your travels:
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a href={`tel:${contactInfo.phone}`} className="text-xl font-bold text-amber-400 hover:underline">{contactInfo.phone}</a>
              <a href={`mailto:${contactInfo.email}`} className="text-xs text-slate-300 hover:text-white">{contactInfo.email}</a>
              <span className="text-xs text-slate-400">{contactInfo.address}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
