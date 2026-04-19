import Navbar from "@/components/layout/Navbar";
import {
  Hero,
  ProblemSolution,
  TrustBar,
  HowItWorks,
  FeaturedMarketplace,
  FarmerSpotlight,
  Reviews,
  CtaBanner,
  Footer,
} from "@/components/home";

// ─── Page Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProblemSolution />
        <TrustBar />
        <HowItWorks />
        <FeaturedMarketplace />
        <FarmerSpotlight />
        <Reviews />
        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}
