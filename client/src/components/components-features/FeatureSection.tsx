import { Palette, Network, Database } from 'lucide-react';
import { GlowCard } from '../common/GlowCard';

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white font-heading">Precision-Engineered Capabilities</h2>
        <p className="text-[#ccc3d8] max-w-xl mx-auto text-sm font-body">Scale your operations with AI agents that understand your unique business architecture and brand guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Brand System Customizer */}
        <GlowCard className="min-h-[340px]">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-5"><Palette className="h-5 w-5 text-[#d2bbff]" /></div>
            <h3 className="text-xl font-bold text-white mb-2 font-heading">Fully Brandable</h3>
            <p className="text-sm text-[#ccc3d8] leading-relaxed font-body">Match your existing UI with pixel-perfect precision. Customize gradients, typography, and corner radius in real-time.</p>
          </div>
          <div className="mt-6 bg-[#171b26] rounded-xl border border-[#4a4455] p-4 space-y-3">
            <div className="flex gap-2">
              {['#d2bbff', '#4cd7f6', '#ffafd3', '#ccc3d8'].map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white/20 cursor-pointer" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-[#313540] rounded-full" />
              <div className="h-2 w-2/3 bg-[#313540] rounded-full" />
            </div>
          </div>
        </GlowCard>

        {/* Card 2: Neural Ingestion Pipe */}
        <GlowCard className="min-h-[340px]">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#03b5d3]/10 flex items-center justify-center mb-5"><Network className="h-5 w-5 text-[#4cd7f6]" /></div>
            <h3 className="text-xl font-bold text-white mb-2 font-heading">Knowledge Injection</h3>
            <p className="text-sm text-[#ccc3d8] leading-relaxed font-body">Instant RAG pipelines for your documentation. Upload CSVs, scrape URLs, or sync PDFs with a single click.</p>
          </div>
          <div className="space-y-4 mt-6 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#4cd7f6]">description</span>
              <div className="flex-1 h-1.5 bg-[#1c1f2a] rounded-full overflow-hidden">
                <div className="h-full bg-[#4cd7f6] w-full" />
              </div>
              <span className="text-[#4cd7f6] ai-status-pulse">Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#ccc3d8]">link</span>
              <div className="flex-1 h-1.5 bg-[#1c1f2a] rounded-full overflow-hidden">
                <div className="h-full bg-[#4cd7f6] w-1/2 animate-pulse" />
              </div>
              <span className="text-[#ccc3d8]">Parsing</span>
            </div>
          </div>
        </GlowCard>

        {/* Card 3: Deep Context Storage Module */}
        <div className="bg-gradient-to-b from-[#7c3aed]/10 to-transparent border border-[#7c3aed]/20 p-6 rounded-xl flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            src="/database-icon.png"
            alt="Neural network diagram showing interconnected nodes"
          />
          <div className="relative z-10">
            <span className="inline-block text-[12px] font-mono font-bold tracking-widest text-white bg-[#7c3aed] px-2 py-0.5 rounded-md mb-4">PREMIUM</span>
            <h3 className="text-xl font-bold mb-2 text-white font-heading">Deep Data Context</h3>
            <p className="text-sm text-[#ccc3d8] leading-relaxed font-body">Connect your AI directly to order history, user profiles, and CRM data for hyper-personalized interactions.</p>
          </div>
          <div className="relative h-32 flex items-center justify-center mt-4">
            <div className="absolute w-16 h-16 bg-[#7c3aed]/20 border border-[#7c3aed]/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="h-7 w-7 text-[#d2bbff]" />
            </div>
            <div className="absolute w-32 h-32 border border-[#7c3aed]/30 rounded-full animate-ping opacity-20 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}