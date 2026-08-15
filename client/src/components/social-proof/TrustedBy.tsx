import { Boxes, Activity, Hexagon, Layers, CloudLightning } from 'lucide-react';

export function TrustedBy() {
  const logos = [
    { icon: Boxes, name: 'NEXUS', color: 'text-[#7c3aed]' },
    { icon: Activity, name: 'QUANTUM', color: 'text-[#4cd7f6]' },
    { icon: Hexagon, name: 'VORTEX', color: 'text-[#ffafd3]' },
    { icon: Layers, name: 'SYNAPSE', color: 'text-[#7c3aed]' },
    { icon: CloudLightning, name: 'STRATUS', color: 'text-[#4cd7f6]' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
      {/* JetBrains Mono cap tracking header matching DESIGN.md */}
      <p className="text-center font-mono text-[12px] font-semibold tracking-[0.2em] text-[#ccc3d8] opacity-60 mb-12 uppercase">
        Trusted by Innovative Teams
      </p>
      
      {/* Grayscale container handling standard B2B responsive contrast */}
      <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 grayscale opacity-50 contrast-150">
        {logos.map((logo, index) => {
          const IconComponent = logo.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-2 font-heading text-xl font-extrabold text-[#dfe2f1] select-none hover:opacity-100 transition-opacity"
            >
              <IconComponent className={`h-5 w-5 ${logo.color}`} />
              <span className="tracking-tight">{logo.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}