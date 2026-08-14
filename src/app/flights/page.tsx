"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Plane, Search, Calendar, Users, Filter, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useStoreData, INITIAL_FLIGHTS, FlightFare, INITIAL_ENQUIRIES, EnquiryItem, INITIAL_CONTACT, ContactSettings } from "@/lib/storage";

export default function FlightsPage() {
  const [flights] = useStoreData<FlightFare[]>("flights", INITIAL_FLIGHTS);
  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);
  const [contact] = useStoreData<ContactSettings>("contact", INITIAL_CONTACT);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeFlightModal, setActiveFlightModal] = useState<FlightFare | null>(null);

  // Flight Booking State
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightTimeSlot, setFlightTimeSlot] = useState("Morning Slot (09:00 AM)");
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [flightSuccessRef, setFlightSuccessRef] = useState<string | null>(null);

  const openWhatsApp = (message: string) => {
    const phone = (contact?.whatsappNumber || "9645185581").replace(/[^0-9]/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const activeFlights = (flights || []).filter((f) => f && (f.active === undefined || f.active));

  const filteredFlights = activeFlights.filter((flt) => {
    if (!flt) return false;
    const fromCityStr = (flt.fromCity || "").toLowerCase();
    const fromCodeStr = (flt.fromCode || "").toLowerCase();
    const toCityStr = (flt.toCity || "").toLowerCase();
    const toCodeStr = (flt.toCode || "").toLowerCase();
    const sf = searchFrom.toLowerCase();
    const st = searchTo.toLowerCase();

    const matchesFrom = !sf || fromCityStr.includes(sf) || fromCodeStr.includes(sf);
    const matchesTo = !st || toCityStr.includes(st) || toCodeStr.includes(st);
    const matchesClass = selectedClass === "all" || flt.travelClass === selectedClass;
    return matchesFrom && matchesTo && matchesClass;
  });

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFlightModal) return;

    const refCode = `ENQ-FLT-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalFare = activeFlightModal.farePrice * seatsRequested;
    
    // Build WhatsApp message with flight details
    const msg = `Hi! I'd like to book a flight seat.\n\n✈️ *${activeFlightModal.airlineName}*\n📍 Route: ${activeFlightModal.fromCity} (${activeFlightModal.fromCode}) → ${activeFlightModal.toCity} (${activeFlightModal.toCode})\n📌 Class: ${activeFlightModal.travelClass} (${activeFlightModal.tripType})\n🗓️ Travel Date: ${flightDate || activeFlightModal.travelDate || "Flexible"}\n⏰ Preferred Time: ${flightTimeSlot}\n💺 Seats: ${seatsRequested}\n💰 Total Fare: ₹${totalFare.toLocaleString("en-IN")}\n\n👤 Passenger: ${passengerName}\n📞 Phone: ${passengerPhone}\n📧 Email: ${passengerEmail}\n\nRef: ${refCode}`;
    
    const newReq: EnquiryItem = {
      id: refCode,
      name: passengerName.trim() || "Flight Guest",
      email: passengerEmail || "passenger@vip.com",
      phone: passengerPhone || "Not Provided",
      type: "Flight",
      subject: `Flight Booking: ${activeFlightModal.airlineName} (${activeFlightModal.fromCode} → ${activeFlightModal.toCode})`,
      message: `Airline: ${activeFlightModal.airlineName}\nRoute: ${activeFlightModal.fromCity} (${activeFlightModal.fromCode}) to ${activeFlightModal.toCity} (${activeFlightModal.toCode})\nClass: ${activeFlightModal.travelClass} (${activeFlightModal.tripType})\nTravel Date: ${flightDate || activeFlightModal.travelDate}\nPreferred Time Slot: ${flightTimeSlot}\nSeats: ${seatsRequested}`,
      date: new Date().toISOString(),
      status: "New",
      preferredTime: flightTimeSlot,
      travelDate: flightDate || activeFlightModal.travelDate,
      guestsCount: seatsRequested,
      packageOrItemName: `${activeFlightModal.airlineName} ${activeFlightModal.fromCode}-${activeFlightModal.toCode}`,
      totalAmount: totalFare,
    };

    const updated = [newReq, ...(enquiries || [])];
    setEnquiries(updated);
    setFlightSuccessRef(refCode);
    
    // Open WhatsApp
    openWhatsApp(msg);

    // Direct HTTP post to Supabase PostgreSQL
    try {
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "enquiries", value: updated }),
      });
    } catch (err) {
      console.warn("Direct flight booking post notice:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase tracking-widest">
            <Plane size={14} /> VIP Aviation & First Class Fares
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
            Special Flight <span className="gradient-text">Fares & Rates</span>
          </h1>

          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Exclusive airline deals for First Class, Business Class & Premium Economy worldwide.
          </p>

          {/* Flight Search Bar */}
          <div className="glass-card max-w-4xl mx-auto p-4 rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Plane size={16} className="text-sky-400 shrink-0" />
              <input 
                type="text" 
                placeholder="From City / Code" 
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Plane size={16} className="text-sky-400 shrink-0 rotate-90" />
              <input 
                type="text" 
                placeholder="To Destination" 
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Filter size={16} className="text-sky-400 shrink-0" />
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Classes</option>
                <option value="First Class" className="bg-slate-900">First Class</option>
                <option value="Business" className="bg-slate-900">Business Class</option>
                <option value="Economy" className="bg-slate-900">Economy</option>
              </select>
            </div>

            <Button variant="amber" size="md" className="h-full py-2.5" leftIcon={<Search size={16} />}>
              Filter Fares
            </Button>
          </div>
        </div>
      </section>

      {/* Special Fares Cards */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
            Available Exclusive Sky Rates ({filteredFlights.length})
          </h2>
          <span className="text-xs text-slate-400">Prices updated live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFlights.map((flt) => (
            <div 
              key={flt.id} 
              className="glass-card p-6 rounded-3xl border border-white/10 bg-slate-900/60 hover:border-sky-400/40 transition-all duration-300 shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    {flt.airlineLogo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{flt.airlineName}</h3>
                    <span className="text-xs text-slate-400">{flt.travelClass} • {flt.tripType}</span>
                  </div>
                </div>

                {flt.offerBadge && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                    {flt.offerBadge}
                  </span>
                )}
              </div>

              {/* Route Display */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-center sm:text-left">
                  <span className="text-2xl font-bold text-white">{flt.fromCode}</span>
                  <p className="text-xs text-slate-400">{flt.fromCity}</p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{flt.travelDate}</span>
                  <div className="flex items-center gap-2 text-sky-400">
                    <div className="w-8 h-0.5 bg-sky-400/40" />
                    <Plane size={16} />
                    <div className="w-8 h-0.5 bg-sky-400/40" />
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold">{flt.seatsAvailable} seats left</span>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-2xl font-bold text-white">{flt.toCode}</span>
                  <p className="text-xs text-slate-400">{flt.toCity}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Fare Price</span>
                  <span className="text-3xl font-bold text-amber-400">₹{flt.farePrice.toLocaleString("en-IN")}</span>
                </div>

                <Button 
                  variant="amber" 
                  size="md"
                  onClick={() => setActiveFlightModal(flt)}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Reserve Seat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flight Reservation Modal */}
      {activeFlightModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => { setActiveFlightModal(null); setFlightSuccessRef(null); }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-lg w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase text-amber-400 font-bold">{activeFlightModal.airlineName} Special Fare Request</span>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                  {activeFlightModal.fromCode} → {activeFlightModal.toCode} ({activeFlightModal.travelClass})
                </h3>
              </div>
              <button onClick={() => { setActiveFlightModal(null); setFlightSuccessRef(null); }} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            {flightSuccessRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h4 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Flight Request Sent!</h4>
                <p className="text-amber-400 font-mono font-bold text-sm">Reference Code: {flightSuccessRef}</p>
                <p className="text-xs text-slate-300">
                  Your seat reservation request has been submitted to the Admin Aviation Desk. An agent will contact <strong className="text-white">{passengerEmail}</strong> with ticket voucher options.
                </p>
                <Button variant="amber" size="sm" onClick={() => { setActiveFlightModal(null); setFlightSuccessRef(null); }}>
                  Close
                </Button>
              </div>
            ) : (
              <form className="space-y-4 text-xs" onSubmit={handleFlightSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Passenger Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="John Smith" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      placeholder="john@vip.com" 
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
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Seats Count</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={10} 
                      value={seatsRequested}
                      onChange={(e) => setSeatsRequested(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Preferred Travel Date</label>
                    <input 
                      type="date" 
                      value={flightDate || activeFlightModal.travelDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Preferred Time Slot</label>
                    <select
                      value={flightTimeSlot}
                      onChange={(e) => setFlightTimeSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Morning Slot (09:00 AM)">Morning (09:00 AM)</option>
                      <option value="Afternoon Slot (01:30 PM)">Afternoon (01:30 PM)</option>
                      <option value="Night Flight (11:00 PM)">Night Flight (11:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Price ({seatsRequested} seat{seatsRequested > 1 ? "s" : ""})</span>
                    <span className="text-2xl font-bold text-amber-400">₹{(activeFlightModal.farePrice * seatsRequested).toLocaleString("en-IN")}</span>
                  </div>
                  <Button variant="amber" size="md" type="submit" leftIcon={<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>}>
                    Book via WhatsApp
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
