import { useState } from 'react';
import { Copy, Check, Code, Sliders, ChevronDown } from 'lucide-react';

export function EmbedSnippetModule({ agentId }: { agentId: string }) {
  // Track exactly what was copied to prevent overlapping button states
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Configuration states for Section 4 customization
  const [alignX, setAlignX] = useState<'right' | 'left'>('right');
  const [alignY, setAlignY] = useState<'bottom' | 'top'>('bottom');
  const [offsetX, setOffsetX] = useState<string>('40px');
  const [offsetY, setOffsetY] = useState<string>('40px');

  // The universal installation snippet template
  const scriptSnippet = `<script 
  src="https://agent-forge-ac.vercel.app/AgentConfigs/widget.js" 
  data-agent-id="${agentId}" 
  defer
></script>`;

  // Customized snippet with dynamic layout overrides
  const customScriptSnippet = `<script 
  src="https://agent-forge-ac.vercel.app/AgentConfigs/widget.js" 
  data-agent-id="${agentId}" 
  data-align-x="${alignX}" 
  data-align-y="${alignY}" 
  data-offset-x="${offsetX}" 
  data-offset-y="${offsetY}" 
  defer
></script>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="glass-card bg-[#111827]/40 border border-[#1f2937] p-6 rounded-xl text-left space-y-4">
      {/* Title Header */}
      <div className="flex items-center gap-2">
        <Code size={14} className="text-[#4cd7f6]" />
        <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest">
          Plug & Play Widget Integration
        </h3>
      </div>

      <p className="text-xs text-[#ccc3d8] leading-relaxed">
        Copy your unique Agent ID or grab the full script tag to embed this live agent asset into your project.
      </p>

      {/* SECTION 1: AGENT ID ONLY */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold text-[#4a4455] block tracking-wider">
          Agent ID Token
        </span>
        <div className="relative flex items-center justify-between bg-[#0a0e18] border border-[#1f2937] rounded-xl p-3 font-mono text-xs text-[#4cd7f6]">
          <span className="select-all pr-12 truncate">data-agent-id="{agentId}"</span>
          <button
            type="button"
            onClick={() => handleCopy(`data-agent-id="${agentId}"`, 'id')}
            className="absolute right-2 top-1.5 p-2 bg-[#171b26] hover:bg-[#1f2937] border border-[#1f2937] rounded-lg text-[#ccc3d8] hover:text-white transition-all cursor-pointer"
          >
            {copiedType === 'id' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* SECTION 2: FULL EMBED SCRIPT */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold text-[#4a4455] block tracking-wider">
          Complete HTML Implementation Script
        </span>
        <div className="relative bg-[#0a0e18] border border-[#1f2937] rounded-xl p-4 font-mono text-xs text-[#4cd7f6] overflow-x-auto whitespace-pre">
          {scriptSnippet}
          <button
            type="button"
            onClick={() => handleCopy(scriptSnippet, 'script')}
            className="absolute right-3 top-3 p-2 bg-[#171b26] hover:bg-[#1f2937] border border-[#1f2937] rounded-lg text-[#ccc3d8] hover:text-white transition-all cursor-pointer"
          >
            {copiedType === 'script' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
        <p className="text-[10px] text-[#4a4455] italic pl-1">
          * Paste right before the closing <code>&lt;/body&gt;</code> tag of any HTML document.
        </p>
      </div>

      {/* SECTION 3: INTEGRATION TIP */}
      <div className="bg-[#0a0e18] border border-[#1f2937] rounded-xl p-3 text-[10px] text-[#4cd7f6]">
        <strong className="text-[#4cd7f6]">Pro Tip:</strong> Ensure your web application allows cross-origin requests from the domain where this agent is embedded. This is crucial for the widget to function correctly.
      </div>

      {/* SECTION 4: ADVANCED PLACEMENT & POSITION OVERRIDES */}
      <div className="space-y-3 pt-2 border-t border-[#1f2937]/80">
        <div className="flex items-center gap-1.5">
          <Sliders size={13} className="text-[#4cd7f6]" />
          <span className="text-[10px] font-mono uppercase font-bold text-[#ccc3d8] block tracking-wider">
            Custom Position & Placement Overrides
          </span>
        </div>

        <p className="text-[11px] text-[#8e849c] leading-relaxed">
          Customize floating axis alignments and boundary offsets to adjust screen placement[cite: 1, 2]:
        </p>

        {/* Interactive Customization Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0a0e18] border border-[#1f2937] p-3 rounded-xl text-xs font-mono">
          {/* Align X */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-[#4a4455] font-bold block">
              Horizontal (X)
            </label>
            <div className="relative">
              <select
                value={alignX}
                onChange={(e) => setAlignX(e.target.value as 'right' | 'left')}
                className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-2 py-1.5 text-[#ccc3d8] text-xs focus:outline-none focus:border-[#4cd7f6] appearance-none cursor-pointer"
              >
                <option value="right">right</option>
                <option value="left">left</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#4a4455] pointer-events-none" />
            </div>
          </div>

          {/* Align Y */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-[#4a4455] font-bold block">
              Vertical (Y)
            </label>
            <div className="relative">
              <select
                value={alignY}
                onChange={(e) => setAlignY(e.target.value as 'bottom' | 'top')}
                className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-2 py-1.5 text-[#ccc3d8] text-xs focus:outline-none focus:border-[#4cd7f6] appearance-none cursor-pointer"
              >
                <option value="bottom">bottom</option>
                <option value="top">top</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#4a4455] pointer-events-none" />
            </div>
          </div>

          {/* Offset X */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-[#4a4455] font-bold block">
              Offset X
            </label>
            <input
              type="text"
              value={offsetX}
              onChange={(e) => setOffsetX(e.target.value)}
              placeholder="e.g. 40px"
              className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-2 py-1.5 text-[#ccc3d8] text-xs focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          {/* Offset Y */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-[#4a4455] font-bold block">
              Offset Y
            </label>
            <input
              type="text"
              value={offsetY}
              onChange={(e) => setOffsetY(e.target.value)}
              placeholder="e.g. 40px"
              className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-2 py-1.5 text-[#ccc3d8] text-xs focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>
        </div>

        {/* Custom Code Preview & Copy */}
        <div className="relative bg-[#0a0e18] border border-[#1f2937] rounded-xl p-4 font-mono text-xs text-[#4cd7f6] overflow-x-auto whitespace-pre">
          {customScriptSnippet}
          <button
            type="button"
            onClick={() => handleCopy(customScriptSnippet, 'custom-script')}
            className="absolute right-3 top-3 p-2 bg-[#171b26] hover:bg-[#1f2937] border border-[#1f2937] rounded-lg text-[#ccc3d8] hover:text-white transition-all cursor-pointer"
            title="Copy customized script tag"
          >
            {copiedType === 'custom-script' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Attribute Reference Table */}
        <div className="bg-[#0a0e18] border border-[#1f2937] rounded-xl p-3 space-y-2">
          <span className="text-[9px] font-mono uppercase font-bold text-[#4a4455] block tracking-wider">
            Attribute Parameters Reference
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="flex items-start justify-between bg-[#111827] p-2 rounded-lg border border-[#1f2937]">
              <div>
                <span className="text-[#ccc3d8] font-bold">data-align-x</span>
                <p className="text-[#645c73] font-sans text-[9px]">Horizontal axis ('left' | 'right')</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('data-align-x="left"', 'attr-align-x')}
                className="p-1 hover:text-white text-[#8e849c]"
                title="Copy attribute"
              >
                {copiedType === 'attr-align-x' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>

            <div className="flex items-start justify-between bg-[#111827] p-2 rounded-lg border border-[#1f2937]">
              <div>
                <span className="text-[#ccc3d8] font-bold">data-align-y</span>
                <p className="text-[#645c73] font-sans text-[9px]">Vertical axis ('bottom' | 'top')</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('data-align-y="bottom"', 'attr-align-y')}
                className="p-1 hover:text-white text-[#8e849c]"
                title="Copy attribute"
              >
                {copiedType === 'attr-align-y' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>

            <div className="flex items-start justify-between bg-[#111827] p-2 rounded-lg border border-[#1f2937]">
              <div>
                <span className="text-[#ccc3d8] font-bold">data-offset-x</span>
                <p className="text-[#645c73] font-sans text-[9px]">Horizontal edge distance (e.g. '24px', '40px')</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('data-offset-x="40px"', 'attr-offset-x')}
                className="p-1 hover:text-white text-[#8e849c]"
                title="Copy attribute"
              >
                {copiedType === 'attr-offset-x' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>

            <div className="flex items-start justify-between bg-[#111827] p-2 rounded-lg border border-[#1f2937]">
              <div>
                <span className="text-[#ccc3d8] font-bold">data-offset-y</span>
                <p className="text-[#645c73] font-sans text-[9px]">Vertical edge distance (e.g. '24px', '40px')</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('data-offset-y="40px"', 'attr-offset-y')}
                className="p-1 hover:text-white text-[#8e849c]"
                title="Copy attribute"
              >
                {copiedType === 'attr-offset-y' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}