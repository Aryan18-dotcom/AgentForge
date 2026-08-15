import { Cpu, Globe, Code2, MessagesSquare } from 'lucide-react';

export function Footer() {
  const linkGroups = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'Experience'],
    },
    {
      title: 'Resources',
      links: ['Docs', 'API Reference', 'Tutorials', 'Blog'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security'],
    },
  ];

  return (
    <footer className="bg-[#0a0e18] w-full mt-24 border-t border-[#4a4455]">
      {/* Multi-column Core Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 px-6 py-16 max-w-7xl mx-auto">
        
        {/* Branding Meta Segment */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] flex items-center justify-center">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold text-[#dfe2f1]">AgentForge</span>
          </div>
          <p className="font-body text-sm text-[#ccc3d8] max-w-xs leading-relaxed">
            The orchestration layer for your company's virtual intelligence. Built for performance, styled for results.
          </p>
          <div className="flex gap-4 pt-2 text-[#ccc3d8]">
            <Globe className="h-4 w-4 hover:text-[#4cd7f6] cursor-pointer transition-colors" />
            <Code2 className="h-4 w-4 hover:text-[#4cd7f6] cursor-pointer transition-colors" />
            <MessagesSquare className="h-4 w-4 hover:text-[#4cd7f6] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Generated Modular Dynamic Link Columns */}
        {linkGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h5 className="font-heading font-bold text-sm text-[#dfe2f1] tracking-wide">
              {group.title}
            </h5>
            <ul className="space-y-2.5">
              {group.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`} 
                    className="font-body text-sm text-[#ccc3d8] hover:text-[#4cd7f6] transition-colors duration-200 block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Operational Dashboard Systems Baseline Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-[#ccc3d8] opacity-80">
        <p>© 2026 AgentForge. All rights reserved.</p>
        
        {/* Animated Custom Pulsing Status Node */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)] animate-pulse" />
          <span className="font-mono text-[13px] text-[#4cd7f6] uppercase tracking-wider">
            All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}