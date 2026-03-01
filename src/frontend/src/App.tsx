import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

/* ── Scroll-fade hook ──────────────────────────────────────── */
function useSectionFadeObserver(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const el of document.querySelectorAll(".section-fade")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);
}

/* ── Testimonials ─────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:
      "Outstanding marble quality and finishing. Every piece is a masterpiece.",
    author: "Rajesh Sharma",
    title: "Interior Designer, Mumbai",
  },
  {
    quote:
      "Perfect luxury gifting products. Our corporate clients were absolutely delighted.",
    author: "Ananya Patel",
    title: "Corporate Procurement, Delhi",
  },
  {
    quote:
      "Authentic Makrana marble craftsmanship at its finest. Truly royal artistry.",
    author: "Vikram Mehra",
    title: "Art Collector, Jaipur",
  },
];

/* ── Collection items ─────────────────────────────────────── */
const COLLECTION = [
  {
    title: "Marble Statues",
    image: "/assets/generated/marble-statues.dim_600x600.jpg",
    description: "Hand-carved deities & figurines in pristine Makrana marble",
  },
  {
    title: "Puja Essentials",
    image: "/assets/generated/puja-essentials.dim_600x600.jpg",
    description:
      "Sacred thalis, diyas & prayer accessories of ritual perfection",
  },
  {
    title: "Luxury Decor",
    image: "/assets/generated/luxury-decor.dim_600x600.jpg",
    description: "Statement pieces that elevate every living space",
  },
  {
    title: "Corporate Gifts",
    image: "/assets/generated/corporate-gifts.dim_600x600.jpg",
    description: "Curated marble gift sets that leave lasting impressions",
  },
];

/* ── App ──────────────────────────────────────────────────── */
export default function App() {
  const { actor } = useActor();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Testimonial slider
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useSectionFadeObserver(mounted);

  // Header scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  const resetTimer = useCallback(() => {
    if (testimonialTimer.current) clearInterval(testimonialTimer.current);
    testimonialTimer.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (testimonialTimer.current) clearInterval(testimonialTimer.current);
    };
  }, [resetTimer]);

  const goToTestimonial = (idx: number) => {
    setActiveTestimonial(idx);
    resetTimer();
  };

  const prevTestimonial = () => {
    goToTestimonial(
      (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };
  const nextTestimonial = () => {
    goToTestimonial((activeTestimonial + 1) % TESTIMONIALS.length);
  };

  // Smooth scroll
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!actor) {
      toast.error("Connection not ready. Please try again in a moment.");
      return;
    }
    setSubmitting(true);
    try {
      await actor.submitInquiry(
        formData.name,
        formData.email,
        formData.phone,
        formData.requirement,
      );
      toast.success(
        "Your inquiry has been received. We'll be in touch shortly.",
        {
          duration: 5000,
        },
      );
      setFormData({ name: "", email: "", phone: "", requirement: "" });
    } catch {
      toast.error(
        "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Collection", id: "collection" },
    { label: "Gallery", id: "instagram" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-background font-serif">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: '"Crimson Pro", Georgia, serif',
            fontSize: "1.05rem",
          },
        }}
      />

      {/* ── Sticky Header ─────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-marble-white/95 backdrop-blur-md shadow-luxury border-b border-gold/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display font-bold tracking-logo text-sm lg:text-base text-gold-dark hover:text-gold transition-colors duration-300"
            aria-label="Marvellmarbles — Back to top"
          >
            MARVELLMARBLES
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-display text-xs tracking-widest2 uppercase text-foreground/70 hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground/70 hover:text-gold transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } bg-marble-white/98 backdrop-blur-md border-b border-gold/20`}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-display text-xs tracking-widest2 uppercase py-3 text-left text-foreground/70 hover:text-gold transition-colors border-b border-gold/10 last:border-0"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          aria-label="Hero"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-marble-bg.dim_1600x900.jpg')",
            }}
            role="presentation"
          />
          {/* Layered overlay: vignette from all edges + dense bottom band for text */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                /* dense bottom band — text lives here */
                "linear-gradient(to top, rgba(18,11,2,0.82) 0%, rgba(18,11,2,0.55) 28%, transparent 55%)",
                /* top vignette — header readability */
                "linear-gradient(to bottom, rgba(18,11,2,0.45) 0%, transparent 30%)",
                /* side vignettes — frame the marble */
                "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(18,11,2,0.45) 100%)",
              ].join(", "),
            }}
          />
          {/* Thin gold line at very bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          {/* Content — pushed slightly below centre for cinematic weight */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 sm:mt-20">
            {/* Pre-heading ornament */}
            <div className="flex items-center justify-center gap-4 mb-8 section-fade">
              <span className="h-px w-14 bg-gold/80" />
              <span className="font-display text-gold/90 text-[0.6rem] tracking-[0.28em] uppercase">
                Makrana · Rajasthan · India
              </span>
              <span className="h-px w-14 bg-gold/80" />
            </div>

            <h1
              className="section-fade font-display font-bold text-white hero-text-shadow mb-5"
              style={{
                fontSize: "clamp(2.6rem, 7.5vw, 5.5rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.015em",
              }}
            >
              Timeless Marble.
              <br />
              <span
                className="text-gold"
                style={{ fontStyle: "italic", letterSpacing: "-0.01em" }}
              >
                Eternal Luxury.
              </span>
            </h1>

            <p
              className="section-fade font-instrument text-xl sm:text-2xl text-white/80 mb-12 tracking-wide leading-relaxed hero-text-shadow"
              style={{ transitionDelay: "80ms" }}
            >
              Handcrafted Makrana Marble Creations
            </p>

            <div className="section-fade" style={{ transitionDelay: "160ms" }}>
              <button
                type="button"
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-display text-[0.65rem] tracking-[0.22em] uppercase px-10 py-4 transition-all duration-300 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-0.5"
                aria-label="Download catalogue"
              >
                <Download size={14} strokeWidth={1.5} />
                Download Catalogue
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45">
            <span className="font-display text-[0.6rem] tracking-[0.22em] uppercase">
              Scroll
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── About / Heritage ──────────────────────────────── */}
        <section
          id="about"
          className="py-24 lg:py-36 px-6 bg-ivory overflow-hidden"
        >
          <div className="max-w-4xl mx-auto">
            <div className="section-fade text-center mb-8">
              <span className="section-eyebrow">Est. Makrana, India</span>
              <h2
                className="section-heading text-foreground"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                Our Heritage
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6 mb-2">
                <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-16 bg-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
            </div>

            <p className="section-fade font-serif-body text-xl sm:text-2xl text-foreground/70 leading-relaxed text-center max-w-2xl mx-auto">
              Founded by{" "}
              <span className="text-gold-dark font-semibold">
                Lalit Prajapat
              </span>
              , Marvellmarbles represents the finest Makrana marble
              craftsmanship — blending royal Indian artistry with modern luxury
              decor and gifting solutions.
            </p>

            {/* Heritage stats */}
            <div className="section-fade mt-16 grid grid-cols-3 gap-6 border-t border-gold/20 pt-12">
              {[
                { stat: "100%", label: "Authentic Makrana" },
                { stat: "500+", label: "Designs Crafted" },
                { stat: "Pan India", label: "Delivery" },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-gold-dark mb-1">
                    {item.stat}
                  </p>
                  <p className="font-display text-xs tracking-widest3 uppercase text-foreground/50">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Collection ────────────────────────────────────── */}
        <section id="collection" className="py-24 lg:py-36 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="section-fade text-center mb-16">
              <span className="section-eyebrow">Handcrafted Excellence</span>
              <h2
                className="section-heading text-foreground"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                Signature Collection
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-16 bg-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {COLLECTION.map((item, i) => (
                <article
                  key={item.title}
                  className="section-fade group cursor-pointer bg-card overflow-hidden shadow-luxury hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-stone-warm">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gold shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card body */}
                  <div className="p-6 lg:p-7 card-shelf">
                    <h3
                      className="font-display font-bold text-foreground mb-3"
                      style={{ fontSize: "1.1rem", letterSpacing: "0.01em" }}
                    >
                      {item.title}
                    </h3>
                    <p className="font-serif-body text-base text-foreground/65 leading-relaxed">
                      {item.description}
                    </p>
                    <div
                      className="mt-5 flex items-center gap-2 text-gold font-display uppercase group-hover:gap-3 transition-all duration-300"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}
                    >
                      <span>Explore</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery / Instagram ───────────────────────────── */}
        <section
          id="instagram"
          className="py-24 lg:py-36 px-6 bg-ivory overflow-hidden"
        >
          <div className="max-w-4xl mx-auto">
            <div className="section-fade text-center mb-14">
              <span className="section-eyebrow">@marvellmarbles</span>
              <h2
                className="section-heading text-foreground"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                Live From Instagram
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-16 bg-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
            </div>

            <div className="section-fade border border-gold/25 shadow-luxury overflow-hidden">
              <iframe
                src="https://www.instagram.com/marvellmarbles/embed"
                height="400"
                style={{ width: "100%", border: "none", display: "block" }}
                title="Marvellmarbles Instagram"
                loading="lazy"
                allowFullScreen
              />
            </div>

            <p className="section-fade text-center mt-6 font-display text-xs tracking-widest3 uppercase text-foreground/40">
              Follow us for daily inspiration
            </p>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────── */}
        <section className="py-24 lg:py-36 px-6 bg-deep-stone overflow-hidden relative">
          {/* Subtle marble texture tint */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-marble-bg.dim_1600x900.jpg')",
              backgroundSize: "cover",
            }}
          />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="section-fade">
              <span className="section-eyebrow">What Our Clients Say</span>
              <h2
                className="section-heading text-white"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
              >
                Client Experience
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6 mb-14">
                <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-16 bg-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
            </div>

            {/* Slider */}
            <div className="section-fade relative">
              <div
                className="text-gold text-5xl font-display mb-6 select-none"
                aria-hidden="true"
              >
                "
              </div>

              <div className="min-h-[120px] flex items-center justify-center">
                <p
                  key={activeTestimonial}
                  className="font-instrument text-xl sm:text-2xl md:text-3xl text-white/90 leading-relaxed italic animate-fade-up"
                >
                  {TESTIMONIALS[activeTestimonial].quote}
                </p>
              </div>

              <div className="mt-8 mb-10">
                <p className="font-display text-sm font-bold text-gold tracking-wide">
                  {TESTIMONIALS[activeTestimonial].author}
                </p>
                <p className="font-display text-xs tracking-widest3 uppercase text-white/40 mt-1">
                  {TESTIMONIALS[activeTestimonial].title}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="p-2 text-white/40 hover:text-gold transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Dots */}
                <div
                  className="flex gap-3"
                  role="tablist"
                  aria-label="Testimonials"
                >
                  {TESTIMONIALS.map((t, i) => (
                    <button
                      type="button"
                      key={t.author}
                      onClick={() => goToTestimonial(i)}
                      role="tab"
                      aria-selected={i === activeTestimonial}
                      aria-label={`Testimonial ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeTestimonial
                          ? "w-6 h-2 bg-gold"
                          : "w-2 h-2 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="p-2 text-white/40 hover:text-gold transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact / Inquiry ─────────────────────────────── */}
        <section id="contact" className="py-24 lg:py-36 px-6 bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="section-fade text-center mb-14">
              <span className="section-eyebrow">
                We'd Love to Hear From You
              </span>
              <h2
                className="section-heading text-foreground"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                Send Inquiry
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-16 bg-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="section-fade bg-card border border-gold/20 shadow-luxury p-8 lg:p-12 space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="font-display text-xs tracking-widest3 uppercase text-foreground/60"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    autoComplete="name"
                    className="font-serif-body text-base bg-ivory border-gold/25 focus:border-gold focus:ring-gold/20 placeholder:text-foreground/35 h-12 rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="font-display text-xs tracking-widest3 uppercase text-foreground/60"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    autoComplete="email"
                    className="font-serif-body text-base bg-ivory border-gold/25 focus:border-gold focus:ring-gold/20 placeholder:text-foreground/35 h-12 rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="font-display text-xs tracking-widest3 uppercase text-foreground/60"
                >
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  autoComplete="tel"
                  className="font-serif-body text-base bg-ivory border-gold/25 focus:border-gold focus:ring-gold/20 placeholder:text-foreground/35 h-12 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="requirement"
                  className="font-display text-xs tracking-widest3 uppercase text-foreground/60"
                >
                  Your Requirement
                </Label>
                <Textarea
                  id="requirement"
                  placeholder="Tell us about the marble pieces you're interested in — statues, puja essentials, home decor, or custom gifts..."
                  rows={5}
                  value={formData.requirement}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, requirement: e.target.value }))
                  }
                  className="font-serif-body text-base bg-ivory border-gold/25 focus:border-gold focus:ring-gold/20 placeholder:text-foreground/35 rounded-none resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gold hover:bg-gold-dark text-white font-display text-xs tracking-widest2 uppercase rounded-none shadow-luxury hover:shadow-luxury-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Sending…
                  </span>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            </form>

            {/* Contact info */}
            <div className="section-fade mt-10 text-center space-y-2">
              <p className="font-display text-xs tracking-widest3 uppercase text-foreground/40 mb-3">
                Or reach us directly
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+917878899189"
                  className="font-display text-lg text-foreground/80 hover:text-gold transition-colors"
                >
                  +91 78788 99189
                </a>
                <span className="hidden sm:block text-gold/40">|</span>
                <a
                  href="tel:+917878750071"
                  className="font-display text-lg text-foreground/80 hover:text-gold transition-colors"
                >
                  +91 78787 50071
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-deep-stone py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <span className="font-display font-bold tracking-logo text-sm text-gold">
            MARVELLMARBLES
          </span>
          <span className="gold-divider block" style={{ maxWidth: 80 }} />
          <p className="font-display text-xs tracking-widest3 uppercase text-white/40 text-center">
            © {new Date().getFullYear()} Marvellmarbles | Global Luxury Marble
            Brand
          </p>
          <p className="font-display text-xs text-white/25 text-center">
            Built with <span className="text-gold/60">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-gold/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* ── Floating WhatsApp button ───────────────────────── */}
      <a
        href="https://wa.me/917878899189"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[oklch(0.57_0.20_145)] hover:bg-[oklch(0.50_0.20_145)] text-white px-4 py-3 shadow-luxury-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,150,60,0.4)] group"
        style={{ borderRadius: "2px" }}
      >
        <MessageCircle size={20} strokeWidth={1.8} />
        <span className="font-display text-xs tracking-widest3 uppercase hidden sm:block">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
