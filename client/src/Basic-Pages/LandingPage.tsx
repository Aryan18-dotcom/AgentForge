import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/hero/Hero';
import { PricingSection } from '../components/pricing/PricingSection';
import { FeaturesSection } from '../components/components-features/FeatureSection';
import { Footer } from '../components/layout/Footer';
import { TrustedBy } from '../components/social-proof/TrustedBy';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] antialiased overflow-x-hidden selection:bg-[#7c3aed]/30 selection:text-[#ede0ff]">
      {/* Background Radial Ambiance Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7c3aed]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[500px] right-1/4 w-[500px] h-[500px] bg-[#03b5d3]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <Navbar />
      <main className="relative space-y-4">
        <Hero />
        <FeaturesSection />
        <PricingSection />
        <TrustedBy />
      </main>
      <Footer />
    </div>
  );
}