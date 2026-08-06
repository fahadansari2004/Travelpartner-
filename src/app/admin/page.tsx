"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Edit, Link as LinkIcon, Compass, Sparkles, Plane, Hotel, 
  ImageIcon, FileText, Phone, Inbox, Settings, Plus, Trash2, Eye, Download, 
  Check, X, Upload, Globe, LogOut, ArrowRight, ShieldCheck, Star, Film, CheckCircle2, Menu
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  useStoreData,
  setStoredData, 
  INITIAL_SERVICES, 
  INITIAL_PACKAGES, 
  INITIAL_FLIGHTS, 
  INITIAL_HOTELS, 
  INITIAL_GALLERY, 
  INITIAL_ABOUT, 
  INITIAL_CONTACT, 
  INITIAL_ENQUIRIES, 
  INITIAL_SEO,
  INITIAL_FOOTER,
  INITIAL_MAIN_PAGE,
  INITIAL_ALBUMS,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_TESTIMONIALS,
  INITIAL_WHY_CHOOSE,
  WhyChooseSettings,
  ServiceItem,
  PackageItem,
  FlightFare,
  HotelItem,
  GalleryItem,
  EnquiryItem,
  SeoSettings,
  AboutSettings,
  ContactSettings,
  FooterSettings,
  MainPageSettings,
  AlbumItem,
  AlbumMedia,
  MediaLibraryItem,
  TestimonialItem
} from "@/lib/storage";

import { FileInputOrUrl, MultiFileInputOrUrl } from "@/components/ui/FileInputOrUrl";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "albums" | "media" | "testimonials" | "mainpage" | "footer" | "services" | "packages" | "flights" | "hotels" | "about" | "contact" | "enquiries" | "seo"
  >("dashboard");

  // Authenticate session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("ADMIN_AUTH") || localStorage.getItem("ADMIN_AUTH");
      if (!isAuth) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // Reactive Store Hooks
  const [services, setServices] = useStoreData<ServiceItem[]>("services", INITIAL_SERVICES);
  const [packages, setPackages] = useStoreData<PackageItem[]>("packages", INITIAL_PACKAGES);
  const [flights, setFlights] = useStoreData<FlightFare[]>("flights", INITIAL_FLIGHTS);
  const [hotels, setHotels] = useStoreData<HotelItem[]>("hotels", INITIAL_HOTELS);
  const [albums, setAlbums] = useStoreData<AlbumItem[]>("albums", INITIAL_ALBUMS);
  const [mediaLibrary, setMediaLibrary] = useStoreData<MediaLibraryItem[]>("mediaLibrary", INITIAL_MEDIA_LIBRARY);
  const [testimonials, setTestimonials] = useStoreData<TestimonialItem[]>("testimonials", INITIAL_TESTIMONIALS);
  const [about, setAbout] = useStoreData<AboutSettings>("about", INITIAL_ABOUT);
  const [contact, setContact] = useStoreData<ContactSettings>("contact", INITIAL_CONTACT);
  const [enquiries, setEnquiries] = useStoreData<EnquiryItem[]>("enquiries", INITIAL_ENQUIRIES);
  const [seo, setSeo] = useStoreData<SeoSettings>("seo", INITIAL_SEO);
  const [footer, setFooter] = useStoreData<FooterSettings>("footerSettings", INITIAL_FOOTER);
  const [mainPage, setMainPage] = useStoreData<MainPageSettings>("mainPageSettings", INITIAL_MAIN_PAGE);
  const [whyChoose, setWhyChoose] = useStoreData<WhyChooseSettings>("whyChoose", INITIAL_WHY_CHOOSE);

  // Search & Filter States
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryFilter, setEnquiryFilter] = useState<"All" | "Package" | "Flight" | "Hotel" | "General">("All");
  const [testimonialFilter, setTestimonialFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState("All");

  // Modal Editing States
  const [editingAlbum, setEditingAlbum] = useState<Partial<AlbumItem> | null>(null);
  const [managingAlbumMedia, setManagingAlbumMedia] = useState<AlbumItem | null>(null);
  const [newAlbumMedia, setNewAlbumMedia] = useState<{ title: string; type: "image" | "video"; url: string; caption: string }>({
    title: "", type: "image", url: "", caption: ""
  });

  const [editingMediaItem, setEditingMediaItem] = useState<Partial<MediaLibraryItem> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingPackage, setEditingPackage] = useState<Partial<PackageItem> | null>(null);
  const [editingFlight, setEditingFlight] = useState<Partial<FlightFare> | null>(null);
  const [editingHotel, setEditingHotel] = useState<Partial<HotelItem> | null>(null);
  const [viewEnquiryModal, setViewEnquiryModal] = useState<EnquiryItem | null>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ADMIN_AUTH");
    }
    router.push("/admin/login");
  };

  // CSV Export for Enquiries & Bookings
  const exportEnquiriesCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Type", "Subject", "Travel Date", "Preferred Time", "Guests", "Total Fare", "Details / Notes", "Date Submitted", "Status"];
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.phone || ""}"`,
      e.type,
      `"${e.subject}"`,
      `"${e.travelDate || ""}"`,
      `"${e.preferredTime || ""}"`,
      e.guestsCount || 1,
      e.totalAmount || 0,
      `"${(e.message || "").replace(/"/g, '""')}"`,
      e.date,
      e.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `travel_bookings_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEnquiries = (enquiries || []).filter((e) => {
    if (!e) return false;
    const typeStr = (e.type || "").toLowerCase();
    const filterStr = enquiryFilter.toLowerCase();
    const matchesFilter =
      enquiryFilter === "All" ||
      typeStr === filterStr ||
      (filterStr === "flight" && (typeStr === "flight" || (e.subject && e.subject.toLowerCase().includes("flight")) || (e.message && e.message.toLowerCase().includes("flight")))) ||
      (filterStr === "package" && (typeStr === "package" || (e.subject && e.subject.toLowerCase().includes("package")) || (e.message && e.message.toLowerCase().includes("package")))) ||
      (filterStr === "hotel" && (typeStr === "hotel" || (e.subject && e.subject.toLowerCase().includes("hotel")) || (e.message && e.message.toLowerCase().includes("hotel"))));

    const q = enquirySearch.toLowerCase();
    const nameStr = (e.name || (e as any).customerName || "").toLowerCase();
    const emailStr = (e.email || "").toLowerCase();
    const subjectStr = (e.subject || e.packageOrItemName || e.message || "").toLowerCase();
    const matchesSearch = !q || nameStr.includes(q) || emailStr.includes(q) || subjectStr.includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredTestimonials = (testimonials || []).filter((t) => {
    if (!t) return false;
    if (testimonialFilter === "All") return true;
    const st = t.status || "Pending";
    return st.toLowerCase() === testimonialFilter.toLowerCase();
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const NAV_TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "albums", label: "Albums", icon: Sparkles, count: albums.length },
    { id: "media", label: "Media Library", icon: ImageIcon, count: mediaLibrary.length },
    { id: "testimonials", label: "Reviews", icon: Star, count: testimonials.filter(t => t.status === "Pending").length },
    { id: "mainpage", label: "Main Page", icon: Edit },
    { id: "whychoose", label: "Why Choose Us", icon: ShieldCheck },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "footer", label: "Footer", icon: LinkIcon },
    { id: "packages", label: "Packages", icon: Sparkles, count: packages.length },
    { id: "flights", label: "Flights", icon: Plane, count: flights.length },
    { id: "hotels", label: "Hotels", icon: Hotel, count: hotels.length },
    { id: "services", label: "Services", icon: Compass, count: services.length },
    { id: "enquiries", label: "Bookings", icon: Inbox, count: enquiries.filter(e => e.status === "New").length },
    { id: "seo", label: "SEO", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row">
      
      {/* ── MOBILE RESPONSIVE HEADER BAR (md:hidden) ────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900/95 border-b border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
            T
          </div>
          <span className="font-bold text-sm tracking-tight font-[family-name:var(--font-playfair)]">
            Admin<span className="gradient-text">Console</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>

      {/* ── MOBILE HORIZONTAL SCROLLABLE TABS BAR (md:hidden) ────────────── */}
      <div className="md:hidden sticky top-[57px] z-30 px-3 py-2 bg-slate-900/90 border-b border-white/10 overflow-x-auto flex items-center gap-2 backdrop-blur-md custom-scrollbar">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
              {isMounted && tab.count !== undefined && tab.count > 0 && (
                <span 
                  suppressHydrationWarning
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isActive ? "bg-slate-950 text-amber-400" : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── MOBILE SLIDE-OUT MENU DRAWER (md:hidden) ───────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Admin Control Desks</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="grid grid-cols-1 gap-2">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                        : "bg-white/5 border border-white/10 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </div>
                    {isMounted && tab.count !== undefined && tab.count > 0 && (
                      <span suppressHydrationWarning className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link href="/" target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" fullWidth leftIcon={<Globe size={14} />}>
                View Live Website
              </Button>
            </Link>
            <Button variant="ghost" size="sm" fullWidth onClick={handleLogout} leftIcon={<LogOut size={14} />}>
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR NAVIGATION (hidden on mobile, visible on md+) ── */}
      <aside className="hidden md:flex w-64 bg-slate-900/80 border-r border-white/10 shrink-0 flex-col justify-between sticky top-0 h-screen">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                T
              </div>
              <span className="font-bold text-sm tracking-tight font-[family-name:var(--font-playfair)]">
                Admin<span className="gradient-text">Console</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" fullWidth leftIcon={<Globe size={14} />}>
              View Live Website
            </Button>
          </Link>
          <Button variant="ghost" size="sm" fullWidth onClick={handleLogout} leftIcon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] capitalize">
              {activeTab === "albums" ? "Album & Story System" : activeTab === "media" ? "Centralized Media Library" : activeTab === "testimonials" ? "Guest Testimonials Approval Desk" : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-slate-400">Live administrative control panel for TravelPartner platform.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset local storage cache to free up memory? Your website will reload with fresh storage.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full transition-all"
            >
              ⚡ Reset Storage Cache
            </button>
            <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Live
            </span>
          </div>
        </div>

        {/* ── DASHBOARD OVERVIEW ───────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button onClick={() => setActiveTab("enquiries")} className="glass-card p-6 rounded-3xl border border-white/10 space-y-2 text-left hover:border-amber-500/50 hover:scale-[1.02] transition-all cursor-pointer group">
                <span className="text-xs text-slate-400 font-semibold uppercase group-hover:text-amber-300">Pending Requests</span>
                <p className="text-3xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">
                  {enquiries.filter((e) => e.status === "New").length}
                </p>
                <span className="text-[11px] text-slate-500 block">Click to view Bookings Desk →</span>
              </button>

              <button onClick={() => setActiveTab("albums")} className="glass-card p-6 rounded-3xl border border-white/10 space-y-2 text-left hover:border-emerald-500/50 hover:scale-[1.02] transition-all cursor-pointer group">
                <span className="text-xs text-slate-400 font-semibold uppercase group-hover:text-emerald-300">Gallery Albums</span>
                <p className="text-3xl font-bold text-emerald-400 font-[family-name:var(--font-playfair)]">
                  {albums.length}
                </p>
                <span className="text-[11px] text-slate-500 block">Click to view Albums Desk →</span>
              </button>

              <button onClick={() => setActiveTab("testimonials")} className="glass-card p-6 rounded-3xl border border-white/10 space-y-2 text-left hover:border-purple-500/50 hover:scale-[1.02] transition-all cursor-pointer group">
                <span className="text-xs text-slate-400 font-semibold uppercase group-hover:text-purple-300">Pending Reviews</span>
                <p className="text-3xl font-bold text-purple-400 font-[family-name:var(--font-playfair)]">
                  {testimonials.filter(t => t.status === "Pending").length}
                </p>
                <span className="text-[11px] text-slate-500 block">Click to approve Reviews →</span>
              </button>

              <button onClick={() => setActiveTab("packages")} className="glass-card p-6 rounded-3xl border border-white/10 space-y-2 text-left hover:border-amber-500/50 hover:scale-[1.02] transition-all cursor-pointer group">
                <span className="text-xs text-slate-400 font-semibold uppercase group-hover:text-white">Active Tour Packages</span>
                <p className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  {packages.length}
                </p>
                <span className="text-[11px] text-slate-500 block">Click to view Packages Desk →</span>
              </button>
            </div>

            {/* Shortcuts */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Administrative Quick Control Desks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="amber" size="sm" leftIcon={<Inbox size={14} />} onClick={() => setActiveTab("enquiries")}>
                  Bookings Desk ({enquiries.filter(e => e.status === "New").length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Star size={14} />} onClick={() => setActiveTab("testimonials")}>
                  Review Stories ({testimonials.filter(t => t.status === "Pending").length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Plane size={14} />} onClick={() => setActiveTab("flights")}>
                  Flight Deals ({flights.length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Hotel size={14} />} onClick={() => setActiveTab("hotels")}>
                  Hotel Listings ({hotels.length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Sparkles size={14} />} onClick={() => setActiveTab("packages")}>
                  Tour Packages ({packages.length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Compass size={14} />} onClick={() => setActiveTab("services")}>
                  Services ({services.length})
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={() => { setActiveTab("albums"); setEditingAlbum({ name: "", destination: "Switzerland", category: "Mountains", featured: true, active: true, images: [], videos: [] }); }}>
                  Create Album
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Edit size={14} />} onClick={() => setActiveTab("mainpage")}>
                  Edit Main Page
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<Phone size={14} />} onClick={() => setActiveTab("contact")}>
                  Edit Contact Info
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE: ALBUMS MANAGEMENT DESK ─────────────────────────────── */}
        {activeTab === "albums" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Travel Albums System</h3>
                <p className="text-xs text-slate-400">Create, edit, and organize destination albums, photos, and videos.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingAlbum({ name: "", destination: "", country: "", category: "Destinations", coverImage: "", shortDesc: "", travelDate: "2026", featured: true, active: true, images: [], videos: [] })}
              >
                Create New Album
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((alb) => (
                <div key={alb.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 bg-slate-900/60 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                      <img src={alb.coverImage} alt={alb.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase">
                          {alb.category}
                        </span>
                        {alb.featured && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        {alb.destination}, {alb.country} ({alb.travelDate})
                      </span>
                      <h4 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-white">{alb.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{alb.shortDesc}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1"><ImageIcon size={14} className="text-amber-400" /> {alb.images?.length || 0} Photos</span>
                      <span className="flex items-center gap-1"><Film size={14} className="text-amber-400" /> {alb.videos?.length || 0} Videos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <Button variant="secondary" size="xs" onClick={() => setManagingAlbumMedia(alb)} leftIcon={<ImageIcon size={12} />}>
                      Manage Media ({alb.images?.length || 0})
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => setEditingAlbum(alb)}>Edit</Button>
                      <Button variant="danger" size="xs" onClick={() => setAlbums(albums.filter(a => a.id !== alb.id))}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE: MEDIA LIBRARY DESK ───────────────────────────────────── */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Centralized Media Library</h3>
                <p className="text-xs text-slate-400">All uploaded photos & video assets stored across the application.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingMediaItem({ name: "", url: "", category: "Gallery", type: "image" })}
              >
                Upload New Media Asset
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {mediaLibrary.map((med) => (
                <div key={med.id} className="glass-card rounded-2xl overflow-hidden border border-white/10 p-3 bg-slate-900/60 space-y-2 relative group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    <img src={med.url} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-400 text-[9px] font-bold uppercase">
                      {med.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white truncate">{med.name}</h5>
                    <p className="text-[10px] text-slate-500">{med.uploadDate}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <button
                      onClick={() => { navigator.clipboard.writeText(med.url); alert("Media URL copied to clipboard!"); }}
                      className="text-[10px] text-amber-400 hover:underline font-semibold"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => setMediaLibrary(mediaLibrary.filter(m => m.id !== med.id))}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE: TESTIMONIALS APPROVAL DESK ──────────────────────────── */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Guest Reviews & Testimonials Approval</h3>
                <p className="text-xs text-slate-400">Review guest experience submissions and approve them to display on the home page.</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10">
                {(["Pending", "Approved", "Rejected", "All"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTestimonialFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      testimonialFilter === tab
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab} {tab === "Pending" && `(${testimonials.filter(t => t.status === "Pending").length})`}
                  </button>
                ))}
              </div>
            </div>

            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/10 text-slate-400 text-xs">
                No reviews found in status: {testimonialFilter}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTestimonials.map((test) => (
                  <div key={test.id} className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/60 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover border border-amber-500/40" />
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                              {test.name}
                            </h4>
                            <p className="text-xs text-slate-400">{test.role} • {test.location}</p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          test.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                          test.status === "Pending" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse" :
                          "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}>
                          {test.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: test.rating || 5 }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400" />
                        ))}
                        <span className="text-xs text-slate-300 font-bold ml-1">{test.trip}</span>
                      </div>

                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        &quot;{test.comment}&quot;
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500">Submitted: {test.createdAt}</span>

                      <div className="flex items-center gap-2">
                        {test.status !== "Approved" && (
                          <Button
                            variant="amber"
                            size="xs"
                            onClick={() => {
                              setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, status: "Approved" } : t));
                              setTestimonialFilter("Approved");
                            }}
                            leftIcon={<CheckCircle2 size={12} />}
                          >
                            Approve & Publish
                          </Button>
                        )}
                        {test.status !== "Rejected" && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, status: "Rejected" } : t));
                              setTestimonialFilter("Rejected");
                            }}
                          >
                            Reject
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => setTestimonials(testimonials.filter(t => t.id !== test.id))}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MODULE: MAIN PAGE SECTIONS EDITOR ────────────────────────────── */}
        {activeTab === "mainpage" && (
          <div className="glass-card max-w-4xl p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Main Page Titles & Hero Editor</h3>
              <p className="text-xs text-slate-400 mt-1">Customize headlines, hero media banner, and titles across all sections.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setMainPage({ ...mainPage }); setStoredData("mainPage", mainPage); alert("Main page section titles updated & synced to live website!"); }} className="space-y-6 text-xs">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">1. Hero Banner Section</h4>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hero Main Headline</label>
                  <input type="text" value={mainPage.heroHeadline || ""} onChange={(e) => setMainPage({ ...mainPage, heroHeadline: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hero Subtitle</label>
                  <input type="text" value={mainPage.heroSubtitle || ""} onChange={(e) => setMainPage({ ...mainPage, heroSubtitle: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white" />
                </div>
                <FileInputOrUrl label="Hero Video or Cover Image URL" value={mainPage.heroMediaUrl || ""} onChange={(val) => setMainPage({ ...mainPage, heroMediaUrl: val })} accept="video/*,image/*" />
              </div>

              <Button variant="amber" size="md" type="submit">Save Main Page Changes</Button>
            </form>
          </div>
        )}

        {/* ── MODULE: WHY CHOOSE US EDITOR ─────────────────────────────────── */}
        {activeTab === "whychoose" && (
          <div className="glass-card max-w-4xl p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Why Choose Us Section Management</h3>
                <p className="text-xs text-slate-400 mt-1">Customize section headline and the 3 feature cards displayed on the home page.</p>
              </div>
              <Button
                variant="amber"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => {
                  const items = whyChoose?.items || INITIAL_WHY_CHOOSE.items;
                  const newItem = { id: `wc-${Date.now()}`, title: "New Feature", desc: "Feature explanation..." };
                  const updated = { ...whyChoose, items: [...items, newItem] };
                  setWhyChoose(updated);
                  setStoredData("whyChoose", updated);
                }}
              >
                Add Feature Card
              </Button>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                setWhyChoose({ ...whyChoose }); 
                setStoredData("whyChoose", whyChoose); 
                alert("Why Choose Us section updated & published live!"); 
              }} 
              className="space-y-6 text-xs"
            >
              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Section Main Headline</label>
                <input 
                  type="text" 
                  value={whyChoose.sectionTitle || "Why Discerning Travelers Choose travelPartner"} 
                  onChange={(e) => setWhyChoose({ ...whyChoose, sectionTitle: e.target.value })} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Feature Cards List ({whyChoose.items?.length || 0})</h4>
                
                {(whyChoose.items || INITIAL_WHY_CHOOSE.items).map((item, idx) => (
                  <div key={item.id || idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Feature #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = whyChoose.items.filter((_, i) => i !== idx);
                          const updated = { ...whyChoose, items: updatedItems };
                          setWhyChoose(updated);
                          setStoredData("whyChoose", updated);
                        }}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove Feature
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-300 font-semibold">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...whyChoose.items];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          setWhyChoose({ ...whyChoose, items: newItems });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-300 font-semibold">Description</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const newItems = [...whyChoose.items];
                          newItems[idx] = { ...newItems[idx], desc: e.target.value };
                          setWhyChoose({ ...whyChoose, items: newItems });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="amber" size="md" type="submit">
                Save Why Choose Us Changes
              </Button>
            </form>
          </div>
        )}

        {/* ── MODULE: FOOTER SECTION EDITOR ──────────────────────────────── */}
        {activeTab === "footer" && (
          <div className="glass-card max-w-3xl p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Footer Section Management</h3>
              <p className="text-xs text-slate-400 mt-1">Edit brand description, contact email, phone, social URLs, and copyright notice.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setFooter({ ...footer }); setStoredData("footer", footer); alert("Footer settings saved & synced to live website!"); }} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Footer Brand Description</label>
                <textarea rows={3} value={footer.brandDescription || ""} onChange={(e) => setFooter({ ...footer, brandDescription: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Contact Email</label>
                  <input type="email" value={footer.email || ""} onChange={(e) => setFooter({ ...footer, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input type="text" value={footer.phone || ""} onChange={(e) => setFooter({ ...footer, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Instagram URL</label>
                    <input type="url" value={footer.instagram || ""} onChange={(e) => setFooter({ ...footer, instagram: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-300 font-semibold mb-1">Facebook URL</label>
                    <input type="url" value={footer.facebook || ""} onChange={(e) => setFooter({ ...footer, facebook: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white" />
                  </div>
                </div>
              </div>

              <Button variant="amber" size="md" type="submit">Save Footer Settings</Button>
            </form>
          </div>
        )}

        {/* ── MODULE: CONTACT PAGE EDITOR ─────────────────────────────────── */}
        {activeTab === "contact" && (
          <div className="glass-card max-w-4xl p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Contact Info & Concierge Desk Settings</h3>
              <p className="text-xs text-slate-400 mt-1">Manage global concierge office details, phone numbers, email address, opening hours, and WhatsApp contact number.</p>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                setContact({ ...contact }); 
                setStoredData("contact", contact); 
                alert("Contact details successfully updated & synced live across the site!"); 
              }} 
              className="space-y-6 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Concierge Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={contact.email || ""} 
                    onChange={(e) => setContact({ ...contact, email: e.target.value })} 
                    placeholder="info@travelpartner.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">VIP Concierge Phone / Hotline *</label>
                  <input 
                    type="text" 
                    required
                    value={contact.phone || ""} 
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })} 
                    placeholder="+1 (800) 555-TRAVEL"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">WhatsApp Support Number *</label>
                  <input 
                    type="text" 
                    required
                    value={contact.whatsappNumber || "9645185581"} 
                    onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value })} 
                    placeholder="9645185581"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Desk Opening Hours</label>
                  <input 
                    type="text" 
                    value={contact.openingHours || ""} 
                    onChange={(e) => setContact({ ...contact, openingHours: e.target.value })} 
                    placeholder="Mon - Sat: 9:00 AM - 8:00 PM EST"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Headquarters Office Address</label>
                <textarea 
                  rows={2} 
                  value={contact.address || ""} 
                  onChange={(e) => setContact({ ...contact, address: e.target.value })} 
                  placeholder="123 Explorer Way, San Francisco, CA 94105"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Google Maps Embed URL</label>
                <input 
                  type="text" 
                  value={contact.mapEmbedUrl || ""} 
                  onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })} 
                  placeholder="https://maps.google.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400" 
                />
              </div>

              <Button variant="amber" size="md" type="submit">
                Save Contact Info Changes
              </Button>
            </form>
          </div>
        )}

        {/* ── MODULE: BOOKINGS & ENQUIRIES DESK ──────────────────────────── */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Bookings & Customer Requests</h3>
                <p className="text-xs text-slate-400">All guest package bookings, flight reservations, and general enquiries.</p>
              </div>
              <Button variant="amber" size="sm" onClick={exportEnquiriesCSV} leftIcon={<Download size={14} />}>
                Export CSV List
              </Button>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {(["All", "Package", "Flight", "Hotel", "General"] as const).map((cat) => {
                    const count = cat === "All"
                      ? enquiries.length
                      : enquiries.filter(e => {
                          const t = (e.type || "").toLowerCase();
                          const c = cat.toLowerCase();
                          return t === c || (e.subject && e.subject.toLowerCase().includes(c)) || (e.message && e.message.toLowerCase().includes(c));
                        }).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setEnquiryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          enquiryFilter === cat ? "bg-amber-500 text-slate-950 shadow-md" : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          enquiryFilter === cat ? "bg-slate-950 text-amber-400" : "bg-white/10 text-slate-300"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Search guest name, email..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Item / Route</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400">{enq.date}</td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {enq.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{enq.email}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                            {enq.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-200">{enq.packageOrItemName || enq.subject}</td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {enq.travelDate || "Flexible"}
                          {enq.preferredTime && <span className="block text-[10px] text-amber-400">{enq.preferredTime}</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={enq.status}
                            onChange={(e) => {
                              setEnquiries(enquiries.map(item => item.id === enq.id ? { ...item, status: e.target.value as any } : item));
                            }}
                            className="bg-slate-900 border border-white/10 text-white rounded-lg px-2 py-1 text-[11px]"
                          >
                            <option value="New">New</option>
                            <option value="Read">Read</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button variant="ghost" size="xs" onClick={() => setViewEnquiryModal(enq)}>View</Button>
                          <Button variant="danger" size="xs" onClick={() => setEnquiries(enquiries.filter(e => e.id !== enq.id))}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE: PACKAGES MANAGEMENT DESK ───────────────────────────── */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Tour Packages Management</h3>
                <p className="text-xs text-slate-400">Manage curated travel packages, pricing, discounts, and itineraries.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingPackage({ name: "", destination: "", duration: "5 Days / 4 Nights", price: 1999, featured: true, active: true, image: "", description: "" })}
              >
                Create New Package
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 bg-slate-900/60 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-bold">
                          ${pkg.price} / person
                        </span>
                        {pkg.featured && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        {pkg.destination} • {pkg.duration}
                      </span>
                      <h4 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-white">{pkg.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <span className="text-xs text-slate-300 font-semibold">
                      Status: {pkg.active ? <span className="text-emerald-400">Active</span> : <span className="text-red-400">Hidden</span>}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => setEditingPackage(pkg)}>Edit</Button>
                      <Button variant="danger" size="xs" onClick={() => setPackages(packages.filter(p => p.id !== pkg.id))}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE: FLIGHTS MANAGEMENT DESK ───────────────────────────── */}
        {activeTab === "flights" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Special Flight Fares & Airlines</h3>
                <p className="text-xs text-slate-400">Manage VIP flight offers, first class deals, and routes.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingFlight({ airlineName: "Emirates", fromCity: "New York", fromCode: "JFK", toCity: "Dubai", toCode: "DXB", farePrice: 3499, travelClass: "First Class", tripType: "Round Trip", featured: true, active: true })}
              >
                Add Flight Deal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flights.map((flt) => (
                <div key={flt.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 bg-slate-900/60 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{flt.airlineName}</span>
                      <span className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-bold">
                        {flt.travelClass} ({flt.tripType})
                      </span>
                    </div>
                    <h4 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white">
                      {flt.fromCity} ({flt.fromCode}) → {flt.toCity} ({flt.toCode})
                    </h4>
                    <p className="text-xs text-slate-400">Fare: <span className="text-amber-300 font-bold">${flt.farePrice}</span> • Duration: {flt.duration || "Direct"}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <span className="text-xs text-slate-400">Travel Date: {flt.travelDate || "Flexible"}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => setEditingFlight(flt)}>Edit</Button>
                      <Button variant="danger" size="xs" onClick={() => setFlights(flights.filter(f => f.id !== flt.id))}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE: HOTELS MANAGEMENT DESK ───────────────────────────── */}
        {activeTab === "hotels" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Luxury Hotels & Resorts</h3>
                <p className="text-xs text-slate-400">Manage 5-star hotel listings, overwater villas, and rates.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingHotel({ name: "", location: "Maldives", pricePerNight: 850, rating: 5.0, image: "", featured: true, active: true })}
              >
                Add Hotel Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((htl) => (
                <div key={htl.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 bg-slate-900/60 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                      <img src={htl.image} alt={htl.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-bold">
                        ${htl.pricePerNight} / night
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">{htl.location}</span>
                      <h4 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-white">{htl.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <span className="text-xs text-amber-400 font-bold">★ {htl.rating}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => setEditingHotel(htl)}>Edit</Button>
                      <Button variant="danger" size="xs" onClick={() => setHotels(hotels.filter(h => h.id !== htl.id))}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE: SERVICES MANAGEMENT DESK ─────────────────────────── */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Concierge Services</h3>
                <p className="text-xs text-slate-400">Manage tailor-made travel concierge and luxury services.</p>
              </div>
              <Button
                variant="amber"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingService({ title: "", category: "Concierge", shortDesc: "", active: true })}
              >
                Add New Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 bg-slate-900/60 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">{srv.category}</span>
                    <h4 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-white">{srv.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{srv.shortDesc}</p>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-white/10 gap-1">
                    <Button variant="ghost" size="xs" onClick={() => setEditingService(srv)}>Edit</Button>
                    <Button variant="danger" size="xs" onClick={() => setServices(services.filter(s => s.id !== srv.id))}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── CREATE / EDIT PACKAGE MODAL ────────────────────────────────────── */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4 my-auto">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              {editingPackage.id ? "Edit Tour Package" : "Create New Tour Package"}
            </h3>

            <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Package Title *</label>
                  <input
                    type="text"
                    value={editingPackage.name || ""}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    placeholder="e.g. Swiss Alps Luxury & Glacier Chalets"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Destination *</label>
                  <input
                    type="text"
                    value={editingPackage.destination || ""}
                    onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value })}
                    placeholder="e.g. Zermatt, Switzerland"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Duration *</label>
                  <input
                    type="text"
                    value={editingPackage.duration || ""}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    placeholder="e.g. 7 Days / 6 Nights"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Standard Price ($) *</label>
                  <input
                    type="number"
                    value={editingPackage.price || 0}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    value={editingPackage.discountPrice || editingPackage.price || 0}
                    onChange={(e) => setEditingPackage({ ...editingPackage, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Cover Image URL / Local File *</label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={editingPackage.image || ""}
                    onChange={(e) => setEditingPackage({ ...editingPackage, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload file"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                  <label className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                    <span>📁 Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setEditingPackage({ ...editingPackage, image: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Short Description</label>
                <textarea
                  value={editingPackage.shortDesc || editingPackage.description || ""}
                  onChange={(e) => setEditingPackage({ ...editingPackage, shortDesc: e.target.value, description: e.target.value })}
                  placeholder="Brief summary of the package experience..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-emerald-400 font-semibold mb-1">What&apos;s Included (1 item per line) *</label>
                  <textarea
                    value={Array.isArray(editingPackage.included) ? editingPackage.included.join("\n") : (editingPackage.included || "")}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n");
                      setEditingPackage({ ...editingPackage, included: lines as any });
                    }}
                    placeholder="5-Star Luxury Resort Stay&#10;Daily Gourmet Breakfast&#10;Private Airport Transfer&#10;Guided Excursions"
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-red-400 font-semibold mb-1">What&apos;s Excluded (1 item per line) *</label>
                  <textarea
                    value={Array.isArray(editingPackage.excluded) ? editingPackage.excluded.join("\n") : (editingPackage.excluded || "")}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n");
                      setEditingPackage({ ...editingPackage, excluded: lines as any });
                    }}
                    placeholder="International Airfare&#10;Personal Shopping & Expenses&#10;Travel Insurance & Visa Fees"
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPackage.featured || false}
                    onChange={(e) => setEditingPackage({ ...editingPackage, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPackage.active !== false}
                    onChange={(e) => setEditingPackage({ ...editingPackage, active: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Publish & Active</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" size="sm" onClick={() => setEditingPackage(null)}>
                Cancel
              </Button>
              <Button
                variant="amber"
                size="sm"
                onClick={() => {
                  if (!editingPackage.name || !editingPackage.destination) {
                    alert("Please provide a package title and destination.");
                    return;
                  }

                  const incArr = Array.isArray(editingPackage.included)
                    ? (editingPackage.included as any[]).map(s => String(s).trim()).filter(s => s.length > 0)
                    : typeof editingPackage.included === "string"
                    ? (editingPackage.included as string).split("\n").map(s => s.trim()).filter(s => s.length > 0)
                    : [];

                  const excArr = Array.isArray(editingPackage.excluded)
                    ? (editingPackage.excluded as any[]).map(s => String(s).trim()).filter(s => s.length > 0)
                    : typeof editingPackage.excluded === "string"
                    ? (editingPackage.excluded as string).split("\n").map(s => s.trim()).filter(s => s.length > 0)
                    : [];

                  const newPkgItem: PackageItem = {
                    id: editingPackage.id || `pkg-${Date.now()}`,
                    name: editingPackage.name,
                    destination: editingPackage.destination,
                    duration: editingPackage.duration || "5 Days / 4 Nights",
                    price: Number(editingPackage.price || 1999),
                    discountPrice: Number(editingPackage.discountPrice || editingPackage.price || 1999),
                    image: editingPackage.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                    rating: Number(editingPackage.rating || 4.9),
                    reviewsCount: Number(editingPackage.reviewsCount || 45),
                    featured: editingPackage.featured ?? true,
                    active: editingPackage.active ?? true,
                    shortDesc: editingPackage.shortDesc || editingPackage.description || "Luxury tour package",
                    description: editingPackage.description || editingPackage.shortDesc || "Luxury tour package",
                    included: incArr,
                    excluded: excArr,
                    itinerary: editingPackage.itinerary || [
                      { day: 1, title: "VIP Arrival & Luxury Resort Check-in", desc: "Private transfer to resort with welcome champagne reception." },
                      { day: 2, title: "Guided Excursion & Sightseeing Tour", desc: "Full-day bespoke guided tour with private expert guide." },
                      { day: 3, title: "Leisure & Fine Dining Experience", desc: "Relax at world-class spa facilities and private gourmet dining." }
                    ],
                  };

                  if (editingPackage.id) {
                    setPackages(packages.map((p) => (p.id === editingPackage.id ? newPkgItem : p)));
                  } else {
                    setPackages([newPkgItem, ...packages]);
                  }
                  setEditingPackage(null);
                }}
              >
                Save Package
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT ALBUM MODAL ────────────────────────────────────── */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4 my-auto">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              {editingAlbum.id ? "Edit Album Details" : "Create New Travel Album"}
            </h3>

            <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Album Title *</label>
                  <input
                    type="text"
                    value={editingAlbum.name || ""}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, name: e.target.value })}
                    placeholder="e.g. Switzerland Luxury Tour"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={editingAlbum.category || "Destinations"}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    {["Destinations", "Experiences", "Packages", "Beaches", "Mountains", "Hotels", "Flights", "Luxury", "Adventure", "Family", "Honeymoon", "Pilgrimage", "Cruises", "Videos"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Destination City *</label>
                  <input
                    type="text"
                    value={editingAlbum.destination || ""}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, destination: e.target.value })}
                    placeholder="e.g. Zermatt & Zurich"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Country *</label>
                  <input
                    type="text"
                    value={editingAlbum.country || ""}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, country: e.target.value })}
                    placeholder="e.g. Switzerland"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Travel Date</label>
                  <input
                    type="text"
                    value={editingAlbum.travelDate || ""}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, travelDate: e.target.value })}
                    placeholder="e.g. Dec 2025"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <FileInputOrUrl
                label="Album Main Cover Image"
                value={editingAlbum.coverImage || ""}
                onChange={(val) => setEditingAlbum({ ...editingAlbum, coverImage: val })}
              />

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Short Description *</label>
                <input
                  type="text"
                  value={editingAlbum.shortDesc || ""}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, shortDesc: e.target.value })}
                  placeholder="Summary for album cards..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Travel Story / Full Overview</label>
                <textarea
                  rows={3}
                  value={editingAlbum.longDesc || ""}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, longDesc: e.target.value })}
                  placeholder="Detailed narrative of the travel experience..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAlbum.featured || false}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAlbum.active !== false}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, active: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Published & Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <Button variant="ghost" size="sm" onClick={() => setEditingAlbum(null)}>Cancel</Button>
              <Button variant="amber" size="sm" onClick={() => {
                const updatedAlb: AlbumItem = {
                  id: editingAlbum.id || `alb-${Date.now()}`,
                  name: editingAlbum.name || "New Album",
                  destination: editingAlbum.destination || "Destination",
                  country: editingAlbum.country || "Country",
                  category: editingAlbum.category || "Destinations",
                  coverImage: editingAlbum.coverImage || "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
                  shortDesc: editingAlbum.shortDesc || "Curated luxury travel photo album.",
                  longDesc: editingAlbum.longDesc || "",
                  travelDate: editingAlbum.travelDate || "2026",
                  featured: editingAlbum.featured || false,
                  active: editingAlbum.active !== false,
                  displayOrder: editingAlbum.displayOrder || (albums.length + 1),
                  images: editingAlbum.images || [],
                  videos: editingAlbum.videos || [],
                };

                if (editingAlbum.id) {
                  setAlbums(albums.map(a => a.id === editingAlbum.id ? updatedAlb : a));
                } else {
                  setAlbums([...albums, updatedAlb]);
                }
                setEditingAlbum(null);
              }}>Save Album</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MANAGE ALBUM MEDIA MODAL ────────────────────────────────────── */}
      {managingAlbumMedia && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-4xl w-full p-6 md:p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">{managingAlbumMedia.category}</span>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Media Manager: {managingAlbumMedia.name}</h3>
              </div>
              <button onClick={() => setManagingAlbumMedia(null)} className="text-slate-400 hover:text-white p-2">
                <X size={20} />
              </button>
            </div>

            {/* Add New Media Form */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Add Photo or Video to this Album</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newAlbumMedia.title}
                    onChange={(e) => setNewAlbumMedia({ ...newAlbumMedia, title: e.target.value })}
                    placeholder="e.g. Sunset Peak View"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Media Type</label>
                  <select
                    value={newAlbumMedia.type}
                    onChange={(e) => setNewAlbumMedia({ ...newAlbumMedia, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="image">Photo (Image)</option>
                    <option value="video">Video (MP4 / WebM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Caption / Notes</label>
                  <input
                    type="text"
                    value={newAlbumMedia.caption}
                    onChange={(e) => setNewAlbumMedia({ ...newAlbumMedia, caption: e.target.value })}
                    placeholder="Optional caption..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <FileInputOrUrl
                label="Single Media Asset File / URL"
                value={newAlbumMedia.url}
                onChange={(val) => setNewAlbumMedia({ ...newAlbumMedia, url: val })}
                accept={newAlbumMedia.type === "video" ? "video/*" : "image/*"}
              />

              <div className="flex items-center justify-between gap-4 pt-1">
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => {
                    if (!newAlbumMedia.url) return;
                    const newMediaItem: AlbumMedia = {
                      id: `med-${Date.now()}`,
                      title: newAlbumMedia.title || "Album Media",
                      type: newAlbumMedia.type,
                      url: newAlbumMedia.url,
                      caption: newAlbumMedia.caption,
                      displayOrder: (managingAlbumMedia.images?.length || 0) + 1,
                    };

                    const updatedAlbum = {
                      ...managingAlbumMedia,
                      images: newAlbumMedia.type === "image" ? [...(managingAlbumMedia.images || []), newMediaItem] : managingAlbumMedia.images,
                      videos: newAlbumMedia.type === "video" ? [...(managingAlbumMedia.videos || []), newMediaItem] : managingAlbumMedia.videos,
                    };

                    setAlbums(albums.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
                    setManagingAlbumMedia(updatedAlbum);
                    setNewAlbumMedia({ title: "", type: "image", url: "", caption: "" });
                  }}
                >
                  Add Single Media
                </Button>
              </div>

              {/* ⚡ BATCH MULTI-PHOTO UPLOADER */}
              <div className="pt-3 border-t border-white/10">
                <MultiFileInputOrUrl
                  label="⚡ Fast Batch Upload: Select & Add Multiple Photos at Once"
                  onAddMultiple={(items) => {
                    const newMediaItems: AlbumMedia[] = items.map((it, idx) => ({
                      id: `med-${Date.now()}-${idx}`,
                      title: it.name || `Photo ${idx + 1}`,
                      type: "image",
                      url: it.url,
                      displayOrder: (managingAlbumMedia.images?.length || 0) + idx + 1,
                    }));

                    const updatedAlbum = {
                      ...managingAlbumMedia,
                      images: [...(managingAlbumMedia.images || []), ...newMediaItems],
                    };

                    setAlbums(albums.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a)));
                    setManagingAlbumMedia(updatedAlbum);
                  }}
                />
              </div>
            </div>

            {/* Current Album Media Items Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-300">Album Photo Gallery ({managingAlbumMedia.images?.length || 0})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {managingAlbumMedia.images?.map((img, idx) => (
                  <div key={img.id || idx} className="glass-card rounded-xl p-2 border border-white/10 space-y-2 bg-slate-950 relative group">
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold truncate text-white">{img.title}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          const updated = { ...managingAlbumMedia, coverImage: img.url };
                          setAlbums(albums.map(a => a.id === updated.id ? updated : a));
                          setManagingAlbumMedia(updated);
                        }}
                        className="text-[9px] text-amber-400 hover:underline"
                      >
                        Set Cover
                      </button>
                      <button
                        onClick={() => {
                          const updated = { ...managingAlbumMedia, images: managingAlbumMedia.images.filter(i => i.id !== img.id) };
                          setAlbums(albums.map(a => a.id === updated.id ? updated : a));
                          setManagingAlbumMedia(updated);
                        }}
                        className="text-[9px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MEDIA LIBRARY ASSET MODAL ────────────────────────────── */}
      {editingMediaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Upload Asset to Media Library</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Asset Title *</label>
                <input
                  type="text"
                  value={editingMediaItem.name || ""}
                  onChange={(e) => setEditingMediaItem({ ...editingMediaItem, name: e.target.value })}
                  placeholder="e.g. Dubai Marina Sunset"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={editingMediaItem.category || "Gallery"}
                  onChange={(e) => setEditingMediaItem({ ...editingMediaItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                >
                  <option value="Gallery">Gallery</option>
                  <option value="Package">Package</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Hero">Hero</option>
                  <option value="Destination">Destination</option>
                </select>
              </div>

              <FileInputOrUrl
                label="Media Asset (Photo or Video)"
                value={editingMediaItem.url || ""}
                onChange={(val) => setEditingMediaItem({ ...editingMediaItem, url: val })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingMediaItem(null)}>Cancel</Button>
              <Button variant="amber" size="sm" onClick={() => {
                const newAsset: MediaLibraryItem = {
                  id: `med-${Date.now()}`,
                  name: editingMediaItem.name || "New Asset",
                  url: editingMediaItem.url || "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
                  type: editingMediaItem.type || "image",
                  category: editingMediaItem.category || "Gallery",
                  uploadDate: new Date().toISOString().split("T")[0],
                };
                setMediaLibrary([newAsset, ...mediaLibrary]);
                setEditingMediaItem(null);
              }}>Upload Asset</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW BOOKING ENQUIRY MODAL ───────────────────────────────────── */}
      {viewEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase text-amber-400 font-bold">{viewEnquiryModal.type} Booking Request</span>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">{viewEnquiryModal.name}</h3>
              </div>
              <button onClick={() => setViewEnquiryModal(null)} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div><span className="text-slate-400 block">Email Address</span><span className="font-semibold text-white">{viewEnquiryModal.email}</span></div>
                <div><span className="text-slate-400 block">Phone Number</span><span className="font-semibold text-white">{viewEnquiryModal.phone || "Not provided"}</span></div>
                <div><span className="text-slate-400 block">Travel Date</span><span className="font-semibold text-amber-400">{viewEnquiryModal.travelDate || "Flexible"}</span></div>
                <div><span className="text-slate-400 block">Preferred Time</span><span className="font-semibold text-amber-400">{viewEnquiryModal.preferredTime || "Standard"}</span></div>
                <div><span className="text-slate-400 block">Guests Count</span><span className="font-semibold text-white">{viewEnquiryModal.guestsCount || 1} Guests</span></div>
                <div><span className="text-slate-400 block">Total Amount</span><span className="font-bold text-emerald-400">${viewEnquiryModal.totalAmount || 0}</span></div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Special Notes / Message</span>
                <p className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 leading-relaxed font-light">{viewEnquiryModal.message || "No notes provided."}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="amber" size="sm" onClick={() => setViewEnquiryModal(null)}>Close Window</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT SERVICE MODAL ──────────────────────────────────── */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              {editingService.id ? "Edit Concierge Service" : "Add New Concierge Service"}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Service Title *</label>
                <input
                  type="text"
                  value={editingService.title || editingService.name || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value, name: e.target.value })}
                  placeholder="e.g. Private Helicopter Charter"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={editingService.category || "Concierge"}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  placeholder="e.g. Concierge, Aviation, Yachting"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={editingService.shortDesc || ""}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="Short service description..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                />
              </div>

              <FileInputOrUrl
                label="Cover Image"
                value={editingService.image || ""}
                onChange={(val) => setEditingService({ ...editingService, image: val })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingService(null)}>Cancel</Button>
              <Button variant="amber" size="sm" onClick={() => {
                if (editingService.id) {
                  setServices(services.map(s => s.id === editingService.id ? (editingService as ServiceItem) : s));
                } else {
                  const newSrv: ServiceItem = {
                    id: `srv-${Date.now()}`,
                    title: editingService.title || editingService.name || "New Service",
                    name: editingService.title || editingService.name || "New Service",
                    category: editingService.category || "Concierge",
                    shortDesc: editingService.shortDesc || "Custom travel concierge service.",
                    image: editingService.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
                    active: true,
                  };
                  setServices([newSrv, ...services]);
                }
                setEditingService(null);
              }}>Save Service</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT FLIGHT FARE MODAL ───────────────────────────────── */}
      {editingFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-xl w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              {editingFlight.id ? "Edit Flight Deal" : "Add Special Flight Deal"}
            </h3>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Airline Name *</label>
                  <input
                    type="text"
                    value={editingFlight.airlineName || ""}
                    onChange={(e) => setEditingFlight({ ...editingFlight, airlineName: e.target.value })}
                    placeholder="e.g. Emirates"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Fare Price ($) *</label>
                  <input
                    type="number"
                    value={editingFlight.farePrice || 850}
                    onChange={(e) => setEditingFlight({ ...editingFlight, farePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">From City *</label>
                  <input
                    type="text"
                    value={editingFlight.fromCity || ""}
                    onChange={(e) => setEditingFlight({ ...editingFlight, fromCity: e.target.value })}
                    placeholder="New York"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">From Code *</label>
                  <input
                    type="text"
                    value={editingFlight.fromCode || ""}
                    onChange={(e) => setEditingFlight({ ...editingFlight, fromCode: e.target.value })}
                    placeholder="JFK"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">To City *</label>
                  <input
                    type="text"
                    value={editingFlight.toCity || ""}
                    onChange={(e) => setEditingFlight({ ...editingFlight, toCity: e.target.value })}
                    placeholder="Dubai"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">To Code *</label>
                  <input
                    type="text"
                    value={editingFlight.toCode || ""}
                    onChange={(e) => setEditingFlight({ ...editingFlight, toCode: e.target.value })}
                    placeholder="DXB"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Cabin Class</label>
                  <select
                    value={editingFlight.travelClass || "Economy"}
                    onChange={(e) => setEditingFlight({ ...editingFlight, travelClass: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Trip Type</label>
                  <select
                    value={editingFlight.tripType || "Round Trip"}
                    onChange={(e) => setEditingFlight({ ...editingFlight, tripType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="Round Trip">Round Trip</option>
                    <option value="One Way">One Way</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingFlight(null)}>Cancel</Button>
              <Button variant="amber" size="sm" onClick={() => {
                if (editingFlight.id) {
                  setFlights(flights.map(f => f.id === editingFlight.id ? (editingFlight as FlightFare) : f));
                } else {
                  const newFlight: FlightFare = {
                    id: `flt-${Date.now()}`,
                    airlineName: editingFlight.airlineName || "Emirates",
                    fromCity: editingFlight.fromCity || "New York",
                    fromCode: editingFlight.fromCode || "JFK",
                    toCity: editingFlight.toCity || "Dubai",
                    toCode: editingFlight.toCode || "DXB",
                    tripType: editingFlight.tripType || "Round Trip",
                    travelClass: editingFlight.travelClass || "Economy",
                    farePrice: editingFlight.farePrice || 850,
                    active: true,
                  };
                  setFlights([newFlight, ...flights]);
                }
                setEditingFlight(null);
              }}>Save Flight Deal</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT HOTEL MODAL ────────────────────────────────────── */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-xl w-full p-8 rounded-3xl border border-white/20 bg-slate-900 text-white space-y-4">
            <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
              {editingHotel.id ? "Edit Hotel Listing" : "Add Luxury Hotel Listing"}
            </h3>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    value={editingHotel.name || ""}
                    onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                    placeholder="e.g. Soneva Jani Resort"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Location *</label>
                  <input
                    type="text"
                    value={editingHotel.location || ""}
                    onChange={(e) => setEditingHotel({ ...editingHotel, location: e.target.value })}
                    placeholder="e.g. Noonu Atoll, Maldives"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Price Per Night ($) *</label>
                  <input
                    type="number"
                    value={editingHotel.pricePerNight || 850}
                    onChange={(e) => setEditingHotel({ ...editingHotel, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-300 font-semibold mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    value={editingHotel.rating || 5.0}
                    onChange={(e) => setEditingHotel({ ...editingHotel, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <FileInputOrUrl
                label="Cover Image"
                value={editingHotel.image || (editingHotel.images && editingHotel.images[0]) || ""}
                onChange={(val) => setEditingHotel({ ...editingHotel, image: val, images: [val] })}
              />

              <div>
                <label className="block uppercase text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingHotel.description || ""}
                  onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                  placeholder="Luxury resort description..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingHotel(null)}>Cancel</Button>
              <Button variant="amber" size="sm" onClick={() => {
                const imgUrl = editingHotel.image || (editingHotel.images && editingHotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                const hotelObj: HotelItem = {
                  id: editingHotel.id || `htl-${Date.now()}`,
                  name: editingHotel.name || "Luxury Resort",
                  location: editingHotel.location || "Maldives",
                  pricePerNight: Number(editingHotel.pricePerNight || 850),
                  rating: Number(editingHotel.rating || 5.0),
                  image: imgUrl,
                  images: [imgUrl],
                  description: editingHotel.description || "5-Star Luxury Resort",
                  featured: editingHotel.featured ?? true,
                  active: editingHotel.active ?? true,
                };

                if (editingHotel.id) {
                  setHotels(hotels.map(h => h.id === editingHotel.id ? hotelObj : h));
                } else {
                  setHotels([hotelObj, ...hotels]);
                }
                setEditingHotel(null);
              }}>Save Hotel Listing</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
