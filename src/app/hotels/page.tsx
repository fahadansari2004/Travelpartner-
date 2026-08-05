"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Hotel, MapPin, Star, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useStoreData, INITIAL_HOTELS, HotelItem, INITIAL_ENQUIRIES, EnquiryItem } from "@/lib/storage";

export default function HotelsPage() {
  const [hotels] = useStoreData<HotelItem[]>("hotels", INITIAL_HOTELS);
  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [activeHotelModal, setActiveHotelModal] = useState<HotelItem | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkInDate, setCheckInDate] = useState("2026-09-25");
  const [checkInTime, setCheckInTime] = useState("02:00 PM (Standard Check-in)");
  const [guestsCount, setGuestsCount] = useState(2);
  const [hotelSuccessRef, setHotelSuccessRef] = useState<string | null>(null);

  const activeHotels = hotels.filter((h) => h.active);

  const filteredHotels = activeHotels.filter((htl) => {
    return selectedLocation === "all" || htl.location.toLowerCase().includes(selectedLocation.toLowerCase());
  });

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHotelModal) return;

    const refId = `ENQ-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReq: EnquiryItem = {
      id: refId,
      name: guestName.trim() || "Hotel Guest",
      email: guestEmail || "guest@hotel.com",
      phone: guestPhone || "Not Provided",
      type: "Hotel",
      subject: `Hotel Booking: ${activeHotelModal.name}`,
      message: `Hotel: ${activeHotelModal.name} (${activeHotelModal.location})\nCheck-in Date: ${checkInDate}\nPreferred Check-in Time: ${checkInTime}\nGuests Count: ${guestsCount}\nPrice per night: ${activeHotelModal.currency}${activeHotelModal.pricePerNight}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "New",
      preferredTime: checkInTime,
      travelDate: checkInDate,
      guestsCount: guestsCount,
      packageOrItemName: activeHotelModal.name,
      totalAmount: activeHotelModal.pricePerNight * guestsCount,
    };

    setEnquiries([newReq, ...enquiries]);
    setHotelSuccessRef(refId);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Hotel size={14} /> 7-Star Suites & Private Island Villas
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
            Luxury <span className="gradient-text">Hotels & Resorts</span>
          </h1>

          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Unrivaled hospitality, personal butler service, and breathtaking architectural marvels.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            {["all", "Maldives", "Dubai", "Switzerland", "Paris"].map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                  selectedLocation === loc
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {loc === "all" ? "All Locations" : loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredHotels.map((htl) => (
            <div 
              key={htl.id} 
              className="glass-card rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 group shadow-2xl flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <MapPin size={14} /> {htl.location}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <Star size={14} fill="currentColor" /> {htl.rating}
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white group-hover:text-amber-400 transition-colors">
                  {htl.name}
                </h3>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {htl.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(htl.facilities || []).map((fac, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Nightly Rate</span>
                  <span className="text-2xl font-bold text-amber-400">{htl.currency}{htl.pricePerNight.toLocaleString()}</span>
                </div>

                <Button variant="amber" size="sm" onClick={() => setActiveHotelModal(htl)}>
                  Reserve Suite
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hotel Reservation Modal */}
      {activeHotelModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => { setActiveHotelModal(null); setHotelSuccessRef(null); }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-lg w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase text-amber-400 font-bold">{activeHotelModal.location} Luxury Stay</span>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                  {activeHotelModal.name}
                </h3>
              </div>
              <button onClick={() => { setActiveHotelModal(null); setHotelSuccessRef(null); }} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            {hotelSuccessRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h4 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Reservation Request Submitted!</h4>
                <p className="text-amber-400 font-mono font-bold text-sm">Reference Code: {hotelSuccessRef}</p>
                <p className="text-xs text-slate-300">
                  Your reservation request has been submitted to our Concierge Admin Desk. We will reach out to <strong className="text-white">{guestEmail}</strong>.
                </p>
                <Button variant="amber" size="sm" onClick={() => { setActiveHotelModal(null); setHotelSuccessRef(null); }}>
                  Close
                </Button>
              </div>
            ) : (
              <form className="space-y-4 text-xs" onSubmit={handleHotelSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Guest Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="jane@example.com" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Guests Count</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={10} 
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Check-in Date</label>
                    <input 
                      type="date" 
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Preferred Check-in Time</label>
                    <select
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="12:00 PM (Early Check-in)">12:00 PM (Early Check-in)</option>
                      <option value="02:00 PM (Standard Check-in)">02:00 PM (Standard)</option>
                      <option value="06:00 PM (Late Check-in)">06:00 PM (Late Check-in)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Nightly Rate</span>
                    <span className="text-2xl font-bold text-amber-400">{activeHotelModal.currency}{activeHotelModal.pricePerNight.toLocaleString()}</span>
                  </div>
                  <Button variant="amber" size="md" type="submit">
                    Confirm Reservation Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
