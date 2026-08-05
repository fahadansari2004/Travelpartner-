"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Calendar, Users, Shield, CreditCard, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { mockDestinations } from "@/data/mockDestinations";

import { useStoreData, INITIAL_ENQUIRIES, EnquiryItem } from "@/lib/storage";

function BookingContent() {
  const searchParams = useSearchParams();
  const destId = searchParams.get("destination") || "bali-indonesia";
  const selectedDest = useMemo(
    () => mockDestinations.find((d) => d.id === destId) || mockDestinations[0],
    [destId]
  );

  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [startDate, setStartDate] = useState("2026-09-15");
  const [preferredTime, setPreferredTime] = useState("10:00 AM (Morning)");
  const [travelers, setTravelers] = useState(2);
  const [roomType, setRoomType] = useState<"standard" | "deluxe" | "suite">("deluxe");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["insurance"]);

  // Contact Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  const roomMultiplier = roomType === "standard" ? 1 : roomType === "deluxe" ? 1.25 : 1.6;
  const addonCost = (selectedAddons.includes("insurance") ? 150 : 0) + (selectedAddons.includes("transfer") ? 80 : 0);
  const totalPrice = Math.round(selectedDest.price * travelers * roomMultiplier + addonCost);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBooking = () => {
    const bookingId = `ENQ-PKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReq: EnquiryItem = {
      id: bookingId,
      name: `${firstName} ${lastName}`.trim() || "Guest Traveler",
      email: email || "guest@traveler.com",
      phone: phone || "Not Provided",
      type: "Package",
      subject: `Package Booking: ${selectedDest.name}`,
      message: `Destination: ${selectedDest.name} (${selectedDest.country})\nTravel Date: ${startDate}\nPreferred Time: ${preferredTime}\nGuests: ${travelers}\nRoom Tier: ${roomType}\nAdd-ons: ${selectedAddons.join(", ") || "None"}\nNotes: ${specialRequests || "None"}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "New",
      preferredTime,
      travelDate: startDate,
      guestsCount: travelers,
      packageOrItemName: selectedDest.name,
      totalAmount: totalPrice,
      additionalGuests: travelers > 1 ? `${travelers - 1} additional passenger(s)` : "Single Traveler",
    };

    setEnquiries([newReq, ...enquiries]);
    setConfirmedBookingId(bookingId);
    setStep(4);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Destinations
        </Link>

        {/* Step Progress Bar */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8 flex items-center justify-between">
          {[
            { num: 1, label: "Trip Customization" },
            { num: 2, label: "Traveler Details" },
            { num: 3, label: "Confirmation & Payment" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s.num
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs sm:text-sm font-medium hidden sm:inline ${step >= s.num ? "text-white" : "text-slate-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  1. Customize Your Itinerary
                </h2>

                {/* Date & Time Slot Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Calendar size={16} className="text-amber-400" /> Travel Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Preferred Time Slot</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="10:00 AM (Morning)">10:00 AM (Morning Departure)</option>
                      <option value="02:00 PM (Afternoon)">02:00 PM (Afternoon Slot)</option>
                      <option value="06:00 PM (Evening)">06:00 PM (Sunset / Evening)</option>
                      <option value="Flexible / Full Day">Flexible / Full Day</option>
                    </select>
                  </div>
                </div>

                {/* Travelers Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Users size={16} className="text-amber-400" /> Number of Guests / Items
                  </label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </Button>
                    <span className="text-lg font-bold text-amber-400">{travelers} Guests</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Room Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Room Tier</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "standard", label: "Standard", desc: "Cozy & comfortable" },
                      { id: "deluxe", label: "Deluxe", desc: "Ocean / Scenic View" },
                      { id: "suite", label: "Suite", desc: "Private Pool & Butler" },
                    ].map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setRoomType(room.id as "standard" | "deluxe" | "suite")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          roomType === room.id
                            ? "bg-amber-500/10 border-amber-500 text-amber-400"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <p className="font-semibold text-sm">{room.label}</p>
                        <p className="text-xs text-slate-500 mt-1">{room.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Addons */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="text-sm font-medium text-slate-300">Optional Add-ons</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl glass cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes("insurance")}
                          onChange={() => toggleAddon("insurance")}
                          className="accent-amber-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-200">Full Comprehensive Insurance</p>
                          <p className="text-xs text-slate-500">Coverage for delays & medical</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400">+$150</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl glass cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes("transfer")}
                          onChange={() => toggleAddon("transfer")}
                          className="accent-amber-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-200">Private Airport Transfers</p>
                          <p className="text-xs text-slate-500">Luxury sedan pick-up & drop</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400">+$80</span>
                    </label>
                  </div>
                </div>

                <Button variant="amber" size="lg" fullWidth onClick={() => setStep(2)} rightIcon={<ArrowRight size={16} />}>
                  Continue to Guest Details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  2. Lead Guest Details & Contact
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
                  <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                </div>
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
                <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 uppercase font-semibold">Special Requests / Preferred Time Notes</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Mention dietary preferences, additional guest names, or preferred pickup times..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="secondary" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="amber" size="lg" fullWidth onClick={() => setStep(3)} rightIcon={<CreditCard size={16} />}>
                    Proceed to Review & Submit
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 text-center space-y-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Confirm Booking Request
                </h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Your booking details will be submitted directly to our Admin Desk. No advance payment required!
                </p>

                <div className="text-left bg-slate-900 p-4 rounded-xl space-y-2 text-xs text-slate-300 border border-slate-800">
                  <p><strong className="text-white">Guest:</strong> {firstName} {lastName} ({email})</p>
                  <p><strong className="text-white">Phone:</strong> {phone || "N/A"}</p>
                  <p><strong className="text-white">Travel Date & Time:</strong> {startDate} at {preferredTime}</p>
                  <p><strong className="text-white">Total Estimated Fare:</strong> ${totalPrice.toLocaleString()}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" size="lg" onClick={() => setStep(2)}>
                    Modify Details
                  </Button>
                  <Button
                    variant="amber"
                    size="lg"
                    onClick={handleConfirmBooking}
                  >
                    Submit Request to Admin
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="glass-card rounded-2xl p-8 text-center space-y-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Booking Request Received!
                </h2>
                <p className="text-emerald-400 font-mono text-sm font-bold">
                  Reference Code: {confirmedBookingId}
                </p>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you! Your package booking request for <strong className="text-white">{selectedDest.name}</strong> on <strong className="text-white">{startDate}</strong> has been transmitted to our Admin Desk. An agent will contact you shortly.
                </p>
                <Link href="/packages">
                  <Button variant="amber" size="md">
                    Explore More Packages
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Price Summary Column */}
          <div className="glass-card rounded-2xl p-6 space-y-6 h-fit">
            <div className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={selectedDest.imageUrl}
                  alt={selectedDest.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Badge variant="amber" size="sm">
                  {selectedDest.category}
                </Badge>
                <h3 className="text-lg font-bold text-white mt-1 font-[family-name:var(--font-playfair)]">
                  {selectedDest.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedDest.country}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Base Package</span>
                <span>${selectedDest.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span>x {travelers}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Upgrade</span>
                <span>x {roomMultiplier}</span>
              </div>
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>+${addonCost}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-800 text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-amber-400 text-xl">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/60 p-3 rounded-xl">
              <Shield size={14} className="text-emerald-400 shrink-0" />
              <span>Guaranteed price protection with zero hidden service fees.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-slate-950 pt-28 text-center text-slate-400">Loading booking portal...</div>}>
        <BookingContent />
      </Suspense>
      <Footer />
    </>
  );
}
