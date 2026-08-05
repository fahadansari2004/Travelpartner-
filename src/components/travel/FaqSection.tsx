"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { useGsapReveal } from "@/hooks/useGsapAnimations";

const FAQ_ITEMS = [
  {
    id: "f1",
    category: "General",
    question: "What is included in a luxury expedition package?",
    answer:
      "All our packages include 5-star boutique accommodations, private airport transfers, dedicated 24/7 travel concierge support, curated VIP excursions, and comprehensive trip insurance.",
  },
  {
    id: "f2",
    category: "General",
    question: "Can I customize an itinerary for a private group?",
    answer:
      "Yes! Our travel architects specialize in tailor-made itineraries. Simply request a custom quote or contact our concierge team to build your ideal journey from scratch.",
  },
  {
    id: "f3",
    category: "Booking & Payment",
    question: "What are the payment terms and cancellation policies?",
    answer:
      "We require a 25% refundable deposit to hold your reservation. Final payment is due 45 days before departure. Cancellations made 30+ days prior receive a full refund.",
  },
  {
    id: "f4",
    category: "Booking & Payment",
    question: "Are flights included in the package rates?",
    answer:
      "While international long-haul flights are not included by default, internal regional flights and private helicopter transfers within the itinerary are fully covered.",
  },
  {
    id: "f5",
    category: "Safety & Visas",
    question: "Do you assist with international visa requirements?",
    answer:
      "Yes! Our dedicated visa support team provides full documentation assistance, fast-track passport services, and up-to-date entry requirement guidance for all destinations.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("f1");
  const containerRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08 });

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <Section background="slate-950" padding="xl" borderTop borderBottom glow="purple">
      <SectionHeader
        align="center"
        eyebrow={<Badge variant="purple" size="lg">✦ Support & Clarity</Badge>}
        title={<>Frequently Asked <span className="gradient-text-cool">Questions</span></>}
        subtitle="Everything you need to know about booking, customized itineraries, and travel safety."
      />

      <div ref={containerRef} className="max-w-3xl mx-auto space-y-4">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 ${
                isOpen
                  ? "border-purple-500/40 shadow-lg shadow-purple-500/10 bg-slate-900/80"
                  : "border-slate-800/80 hover:border-purple-500/20"
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-lg font-bold text-white font-[family-name:var(--font-playfair)]">
                  {item.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full glass flex items-center justify-center shrink-0 text-slate-300 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-purple-500/20 text-purple-300" : ""
                  }`}
                >
                  <ChevronDown size={18} />
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 pb-6 px-6" : "grid-rows-[0fr] opacity-0 px-6"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
