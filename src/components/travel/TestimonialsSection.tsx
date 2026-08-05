"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, PlusCircle, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStoreData, INITIAL_TESTIMONIALS, TestimonialItem } from "@/lib/storage";
import { FileInputOrUrl } from "@/components/ui/FileInputOrUrl";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useStoreData<TestimonialItem[]>("testimonials", INITIAL_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal State for Guest Review Submission
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form Fields
  const [guestName, setGuestName] = useState("");
  const [guestLocation, setGuestLocation] = useState("");
  const [guestRole, setGuestRole] = useState("Explorer");
  const [guestTrip, setGuestTrip] = useState("");
  const [guestRating, setGuestRating] = useState(5);
  const [guestAvatar, setGuestAvatar] = useState("");
  const [guestComment, setGuestComment] = useState("");

  // Only show Approved Testimonials
  const approvedTestimonials = testimonials.filter((t) => !t.status || t.status === "Approved" || t.status.toLowerCase() === "approved");

  const activeIndex = approvedTestimonials.length > 0 ? currentIndex % approvedTestimonials.length : 0;
  const current = approvedTestimonials[activeIndex];

  const prev = () => {
    if (approvedTestimonials.length === 0) return;
    setCurrentIndex((idx) => (idx === 0 ? approvedTestimonials.length - 1 : idx - 1));
  };

  const next = () => {
    if (approvedTestimonials.length === 0) return;
    setCurrentIndex((idx) => (idx === approvedTestimonials.length - 1 ? 0 : idx + 1));
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestComment || !guestTrip) return;

    const newTestimonial: TestimonialItem = {
      id: `t-user-${Date.now()}`,
      name: guestName,
      role: guestRole || "Traveler",
      location: guestLocation || "Global Guest",
      avatar: guestAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
      rating: guestRating,
      trip: guestTrip,
      comment: guestComment,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setSubmittedSuccess(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pt-10 pb-4">
      {/* Compact Section Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
          <Sparkles size={12} /> Traveler Stories
        </div>
        <h2 className="text-xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-tight">
          Stories from Our <span className="gradient-text">Global Guests</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light">
          Read verified reviews from adventurers who experienced our curated journeys.
        </p>
      </div>

      {/* Action Button to Submit Review */}
      <div className="flex justify-center pt-1 pb-2">
        <Button
          variant="amber"
          size="sm"
          onClick={() => { setIsSubmitModalOpen(true); setSubmittedSuccess(false); }}
          leftIcon={<PlusCircle size={14} />}
        >
          Share Your Experience
        </Button>
      </div>

      {approvedTestimonials.length > 0 && current ? (
        <div className="glass-card rounded-2xl p-5 sm:p-7 relative border border-white/15 bg-slate-950/80 shadow-2xl transition-all duration-500 flex flex-col justify-between space-y-4 backdrop-blur-xl">
          <Quote
            size={36}
            className="absolute top-5 right-5 text-amber-500/20 pointer-events-none"
          />

          {/* Comment & Rating */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: current.rating || 5 }).map((_, i) => (
                <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-1.5 text-[11px] font-bold text-amber-300">
                Verified {current.rating}.0 Review
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-100 font-[family-name:var(--font-playfair)] italic leading-relaxed">
              &quot;{current.comment}&quot;
            </p>
          </div>

          {/* Author Details & Trip Tag */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/40 shrink-0">
                <Image
                  src={current.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {current.name}
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                </h4>
                <p className="text-[11px] text-slate-400">
                  {current.role} {current.location ? `• ${current.location}` : ""}
                </p>
              </div>
            </div>

            <span className="glass text-amber-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-amber-500/30 max-w-fit">
              ✦ {current.trip}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 glass-card rounded-2xl border border-white/10 text-slate-400 text-xs">
          No guest reviews approved yet. Be the first to share your travel story!
        </div>
      )}

      {/* Navigation Controls */}
      {approvedTestimonials.length > 1 && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {approvedTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-6 bg-amber-400" : "w-1.5 bg-slate-700"
                }`}
                aria-label={`Go to testimonial slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/15 text-slate-200 hover:text-white hover:border-amber-400 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/15 text-slate-200 hover:text-white hover:border-amber-400 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── USER SUBMISSION MODAL ────────────────────────────────────── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-white/15 shadow-2xl relative space-y-5 bg-slate-900 text-white">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5"
            >
              <X size={18} />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Thank You!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  Your travel review has been submitted. It will be displayed once approved by our team!
                </p>
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Share Your Journey
                  </span>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Add Your Experience</h3>
                </div>

                <form onSubmit={handleTestimonialSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-slate-300 font-semibold mb-1">City / Country</label>
                      <input
                        type="text"
                        value={guestLocation}
                        onChange={(e) => setGuestLocation(e.target.value)}
                        placeholder="e.g. London, UK"
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-slate-300 font-semibold mb-1">Role / Tag</label>
                      <input
                        type="text"
                        value={guestRole}
                        onChange={(e) => setGuestRole(e.target.value)}
                        placeholder="e.g. Honeymooner"
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Package / Tour Name *</label>
                    <input
                      type="text"
                      required
                      value={guestTrip}
                      onChange={(e) => setGuestTrip(e.target.value)}
                      placeholder="e.g. Maldives Luxury Escape"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setGuestRating(star)}
                          className="p-1 text-amber-400 focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={star <= guestRating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <FileInputOrUrl
                    label="Profile Photo (Upload from System or URL)"
                    value={guestAvatar}
                    onChange={(url) => setGuestAvatar(url)}
                  />

                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Your Review / Experience *</label>
                    <textarea
                      required
                      rows={3}
                      value={guestComment}
                      onChange={(e) => setGuestComment(e.target.value)}
                      placeholder="Write details of your experience..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSubmitModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="amber"
                      size="sm"
                    >
                      Submit Review for Approval
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
