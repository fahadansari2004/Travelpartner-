"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Calendar, Star, Filter, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { useStoreData, INITIAL_PACKAGES, PackageItem, INITIAL_ENQUIRIES, EnquiryItem } from "@/lib/storage";

export default function PackagesPage() {
  const [packages] = useStoreData<PackageItem[]>("packages", INITIAL_PACKAGES);
  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [activePackageModal, setActivePackageModal] = useState<PackageItem | null>(null);

  // Booking Form State within Modal
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [travelDate, setTravelDate] = useState("2026-09-20");
  const [timeSlot, setTimeSlot] = useState("10:00 AM (Morning)");
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState("");
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  const activePackages = packages.filter((pkg) => pkg.active);

  const filteredPackages = activePackages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDest = selectedDestination === "all" || pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase());
    return matchesSearch && matchesDest;
  });

  const handlePackageBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackageModal) return;

    const refId = `ENQ-PKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReq: EnquiryItem = {
      id: refId,
      name: guestName.trim() || "Guest Explorer",
      email: guestEmail || "guest@traveler.com",
      phone: guestPhone || "Not Provided",
      type: "Package",
      subject: `Package Booking: ${activePackageModal.name}`,
      message: `Destination: ${activePackageModal.destination}\nDuration: ${activePackageModal.duration}\nTravel Date: ${travelDate}\nPreferred Time Slot: ${timeSlot}\nGuests: ${guestsCount}\nSpecial Notes: ${specialNotes || "None"}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "New",
      preferredTime: timeSlot,
      travelDate: travelDate,
      guestsCount: guestsCount,
      packageOrItemName: activePackageModal.name,
      totalAmount: (activePackageModal.discountPrice || activePackageModal.price) * guestsCount,
      additionalGuests: guestsCount > 1 ? `${guestsCount - 1} guest(s)` : "Solo",
    };

    setEnquiries([newReq, ...enquiries]);
    setBookingSuccessId(refId);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} /> Tailored Luxury Expeditions
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
            Curated <span className="gradient-text">Tour Packages</span>
          </h1>

          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Hand-crafted 5-star itineraries with private guides, luxury transfers, and exclusive VIP access.
          </p>

          {/* Search & Filter Bar */}
          <div className="glass-card max-w-3xl mx-auto p-4 rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-3 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex-1 w-full">
              <Search size={18} className="text-amber-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search destination or package..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl w-full sm:w-48">
              <Filter size={16} className="text-amber-400 shrink-0" />
              <select 
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Regions</option>
                <option value="Switzerland" className="bg-slate-900">Switzerland</option>
                <option value="Dubai" className="bg-slate-900">Dubai</option>
                <option value="Paris" className="bg-slate-900">Paris</option>
                <option value="Maldives" className="bg-slate-900">Maldives</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="glass-card rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 group shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 z-10" />
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider">
                    {pkg.destination}
                  </div>
                  {pkg.discountPrice && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                      SAVE ${(pkg.price - pkg.discountPrice).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {pkg.duration}</span>
                    <span>★ {pkg.rating} ({pkg.reviewsCount} reviews)</span>
                  </div>

                  <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white group-hover:text-amber-400 transition-colors">
                    {pkg.name}
                  </h3>

                  <div className="space-y-1.5 pt-2">
                    {(pkg.included || []).slice(0, 3).map((item, i) => (
                      <span key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Starting From</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">${(pkg.discountPrice || pkg.price).toLocaleString()}</span>
                    {pkg.discountPrice && <span className="text-xs text-slate-500 line-through">${pkg.price.toLocaleString()}</span>}
                  </div>
                </div>

                <Button 
                  variant="amber" 
                  size="sm"
                  onClick={() => setActivePackageModal(pkg)}
                >
                  View Itinerary
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Package Detail & Booking Modal */}
      {activePackageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => { setActivePackageModal(null); setIsBookingMode(false); setBookingSuccessId(null); }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-2xl w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-6 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">{activePackageModal.destination}</span>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">{activePackageModal.name}</h3>
              </div>
              <button onClick={() => { setActivePackageModal(null); setIsBookingMode(false); setBookingSuccessId(null); }} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            {bookingSuccessId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h4 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Booking Request Submitted!</h4>
                <p className="text-amber-400 font-mono font-bold text-sm">Ref ID: {bookingSuccessId}</p>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your request has been received by our Admin Desk. We will reach out to <strong className="text-white">{guestEmail}</strong> to confirm your itinerary.
                </p>
                <Button variant="amber" size="sm" onClick={() => { setActivePackageModal(null); setIsBookingMode(false); setBookingSuccessId(null); }}>
                  Done
                </Button>
              </div>
            ) : isBookingMode ? (
              <form onSubmit={handlePackageBookingSubmit} className="space-y-4 text-xs">
                <h4 className="text-sm font-bold uppercase text-amber-400">Guest Booking Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Guests Count</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={20}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Preferred Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="10:00 AM (Morning)">10:00 AM (Morning)</option>
                      <option value="02:00 PM (Afternoon)">02:00 PM (Afternoon)</option>
                      <option value="06:00 PM (Evening)">06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Special Requests / Notes</label>
                  <textarea 
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Dietary requests, hotel preferences..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setIsBookingMode(false)}>Back to Itinerary</Button>
                  <Button variant="amber" size="md" type="submit">Submit Request to Admin</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Day-by-Day Itinerary</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {activePackageModal.itinerary.map((day) => (
                      <div key={day.day} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-xs font-bold text-amber-300">Day {day.day}: {day.title}</span>
                        <p className="text-xs text-slate-300">{day.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs font-bold text-emerald-400 uppercase">What&apos;s Included</span>
                      <ul className="mt-2 space-y-1 text-xs text-slate-300">
                        {activePackageModal.included.map((inc, i) => <li key={i}>✓ {inc}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs font-bold text-red-400 uppercase">What&apos;s Excluded</span>
                      <ul className="mt-2 space-y-1 text-xs text-slate-300">
                        {activePackageModal.excluded.map((exc, i) => <li key={i}>✕ {exc}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Package Price</span>
                    <span className="text-3xl font-bold text-amber-400">${(activePackageModal.discountPrice || activePackageModal.price).toLocaleString()}</span>
                  </div>
                  <Button variant="amber" size="lg" onClick={() => setIsBookingMode(true)}>
                    Book This Package Now
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
