"use client";

import { Footer } from "@/components/home";
import Navbar from "@/components/layout/Navbar";
/**
 * app/about/page.tsx
 *
 * About Us — Mission & Vision page for FreshDirect.
 * Uses the existing brand tokens defined in globals.css (@theme):
 *   forest, forest-dark, forest-light, mint, mint-light,
 *   golden, golden-dark, off-white, text-dark, text-mid, text-light, border
 * Fonts: font-serif (Playfair Display) for display type, font-sans (Inter) for body.
 *
 * Images are hotlinked from Unsplash (free Unsplash License, no attribution
 * required) — swap the `src` values for your own photography whenever ready.
 * If you'd rather use next/image, add "images.unsplash.com" to
 * images.remotePatterns in next.config.js first.
 */

import {
  Sprout,
  Handshake,
  Target,
  Eye,
  Leaf,
  Users,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

// ─── Content data ───────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Handshake,
    title: "Direct Trade",
    text: "No collectors, no wholesalers. Every order goes straight from the farmer who grew it to the family who eats it.",
  },
  {
    icon: Leaf,
    title: "Chemical-Free",
    text: "We only list produce grown without synthetic pesticides or wax coatings — food the way it's meant to be.",
  },
  {
    icon: ShieldCheck,
    title: "Fair Pricing",
    text: "Farmers set prices that reflect their work. Our dynamic engine rewards good harvests instead of squeezing them.",
  },
  {
    icon: HeartHandshake,
    title: "Community First",
    text: "Every purchase strengthens a rural livelihood. Growth on this platform means growth for Sri Lankan farming families.",
  },
];

const JOURNEY = [
  {
    year: "2024",
    title: "The Idea Takes Root",
    text: "Frustrated watching farmers earn a fraction of the shelf price, our founders started mapping a shorter, fairer route from field to fridge.",
  },
  {
    year: "2025",
    title: "First 50 Farmers Onboard",
    text: "We began in the highlands of Nuwara Eliya, verifying growers by hand and building the trust that still anchors the platform.",
  },
  {
    year: "2026",
    title: "500+ Farmers, One Mission",
    text: "Today, thousands of families order direct every week — and every order still reaches a real farm within 24 hours.",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="bg-off-white">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative h-[10vh] min-h-[50px] w-full overflow-hidden">
        <Navbar/>
      </section>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=2000&q=80"
          alt="Aerial view of a green tea plantation in the Sri Lankan highlands"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(27,67,50,0.55) 0%, rgba(27,67,50,0.75) 60%, rgba(27,67,50,0.95) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center">
          <span className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mint-light backdrop-blur-sm">
            Our Story
          </span>
          <h1 className="max-w-3xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Grown With Purpose,
            <br />
            Delivered With Trust
          </h1>
          <p className="mt-5 max-w-xl text-sm text-mint-light/90 sm:text-base">
            We're rebuilding the distance between Sri Lankan farms and Sri
            Lankan tables — one direct order at a time.
          </p>
        </div>
      </section>

      {/* ══════════════════════ OUR STORY ══════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest-light">
              Why We Started
            </span>
            <h2 className="mt-3 font-serif text-3xl font-extrabold leading-tight text-text-dark sm:text-4xl">
              A Farmer Earns 20%.
              <br />
              We Thought That Was Wrong.
            </h2>
            <p className="mt-5 leading-[1.8] text-text-mid">
              It started with a simple visit to a vegetable farm outside
              Nuwara Eliya. The tomatoes were extraordinary — and the farmer
              who grew them was struggling, because five middlemen stood
              between his harvest and your kitchen.
            </p>
            <p className="mt-4 leading-[1.8] text-text-mid">
              FreshDirect exists to close that gap. We built a marketplace
              where a farmer can list this morning's harvest and have it on
              your table by tomorrow — with no collector, no distributor, and
              no unnecessary markup standing in between.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(26,48,32,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1489450278009-822e9be04dff?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh vegetables at a Sri Lankan market stand"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ MISSION & VISION (dark panel) ══════════════════════ */}
      <section className="bg-forest-dark py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-golden shadow-[0_8px_24px_rgba(255,183,3,0.35)]">
                <Target className="h-6 w-6 text-forest-dark" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-white">
                Our Mission
              </h3>
              <p className="mt-4 leading-[1.8] text-mint-light/85">
                To connect every verified Sri Lankan farmer directly with the
                families who eat their harvest — cutting out the middlemen,
                shortening the journey from soil to table, and putting fair
                earnings back in farmers' hands.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-light shadow-[0_8px_24px_rgba(82,183,136,0.35)]">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-white">
                Our Vision
              </h3>
              <p className="mt-4 leading-[1.8] text-mint-light/85">
                A Sri Lanka where "farm-fresh" isn't a marketing word but the
                default — where every rural farming family can build a
                sustainable livelihood, and every household trusts exactly
                where its food comes from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ VALUES ══════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest-light">
            What Guides Us
          </span>
          <h2 className="mt-3 font-serif text-3xl font-extrabold text-text-dark sm:text-4xl">
            The Values Behind Every Order
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-white p-7 shadow-[0_4px_20px_rgba(26,48,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(26,48,32,0.12)]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-mint">
                <Icon className="h-5 w-5 text-forest" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-dark">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-mid">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ JOURNEY TIMELINE ══════════════════════ */}
      <section className="bg-mint-light py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest-light">
              How Far We've Come
            </span>
            <h2 className="mt-3 font-serif text-3xl font-extrabold text-text-dark sm:text-4xl">
              Our Journey
            </h2>
          </div>

          <div className="relative pl-10">
            {/* vertical vine line */}
            <div
              className="absolute left-[15px] top-2 bottom-2 w-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-forest-light), var(--color-golden))",
              }}
            />
            <div className="flex flex-col gap-12">
              {JOURNEY.map((step) => (
                <div key={step.year} className="relative">
                  <span
                    className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-mint-light bg-forest text-[0.65rem] font-extrabold text-white shadow-[0_4px_12px_rgba(26,48,32,0.25)]"
                  >
                    <Sprout className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-golden-dark">
                    {step.year}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-text-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-[1.75] text-text-mid">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ 
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-[0_20px_60px_rgba(26,48,32,0.2)] sm:px-16"
          style={{
            background:
              "linear-gradient(135deg, var(--color-forest) 0%, #2D6A4F 60%, var(--color-forest-light) 100%)",
          }}
        >
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
          <Users className="mx-auto mb-5 h-9 w-9 text-golden" />
          <h2 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
            Taste the Difference Yourself
          </h2>
          <p className="mx-auto mt-4 max-w-md text-mint-light/85">
            Join thousands of Sri Lankan families already buying direct from
            the farmers who grow their food.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/shop"
              className="rounded-2xl bg-golden px-7 py-3.5 text-sm font-bold text-forest-dark shadow-[0_8px_24px_rgba(255,183,3,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Shop Fresh Now 🛒
            </a>
            <a
              href="/farmers"
              className="rounded-2xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Meet Our Farmers 👨‍🌾
            </a>
          </div>
        </div>
      </section>*/}
      <Footer/>
    </main>
  );
}