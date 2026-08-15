import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Bot, Database, ToggleLeft, 
  MessageSquare, FileText, ArrowLeft, RefreshCw, Trash2, Sliders, Globe
} from 'lucide-react';
import { useAgent } from '../../hooks/useAgent';
import { fadeInUp, staggerContainer } from '../../../../components/animation/motionVariants';
import LiveChatPreview from '../../../../components/dashboard-components/LiveChatPreview';
import { EmbedSnippetModule } from './EmbedSnippetModule';

interface InjectedFile {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  vectorIngestionStatus: 'PENDING' | 'PROCESSING' | 'PARSED' | 'FAILED';
}

export default function AgentPreview() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { getAgentDetails, toggleAgentOperationalState, decommissionAgent } = useAgent();

  // Local component monitoring states
  const [loading, setLoading] = useState<boolean>(true);
  const [agentData, setAgentData] = useState<any>(null);
  const [associatedFiles, setAssociatedFiles] = useState<InjectedFile[]>([]);
  const [canvasViewMode, setCanvasViewMode] = useState<'minimized' | 'expanded'>('expanded');

  // Load the structural context specs from your Express routes on boot
  const loadAgentTelemetry = async () => {
    if (!agentId) return;
    try {
      const data = await getAgentDetails(agentId);
      if (data.success) {
        setAgentData(data.agent);
        setAssociatedFiles(data.files || []);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to establish synchronization handshake.");
      navigate('/my-creations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgentTelemetry();
  }, [agentId]);

  // Handle operation flip updates
  const handleToggleState = async () => {
    if (!agentId || !agentData) return;
    const res = await toggleAgentOperationalState(agentId);
    if (res.success) {
      setAgentData((prev: any) => ({ ...prev, status: res.status }));
      toast.success(`Pipeline operational state: ${res.status.toUpperCase()}`);
    } else {
      toast.error("Failed to alter runtime state.");
    }
  };

  // Handle complete core database clear loops
  const handleDecommission = async () => {
    if (!agentId) return;
    if (confirm("Are you explicitly sure you want to decommission this pipeline asset? This will clear all vectors and conversational cache logs permanently.")) {
      const res = await decommissionAgent(agentId);
      if (res.success) {
        toast.success("Agent architecture deleted cleanly.");
        navigate('/my-creations');
      } else {
        toast.error("Decommission protocol rejected.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center font-mono text-xs text-[#4cd7f6]">
        <RefreshCw size={20} className="animate-spin mb-2 text-[#7c3aed]" />
        <span className="ai-status-pulse">Synchronizing Telemetry Tracks...</span>
      </div>
    );
  }

  if (!agentData) return null;

  return (
    <div className="h-full w-full font-body pb-12 select-none">
      
      {/* HEADER CONTROL ACTIONS BAR */}
      <div className="flex justify-between items-center bg-[#111827]/30 border border-[#1f2937] p-4 rounded-xl mb-6 backdrop-blur-xs">
        <button 
          onClick={() => navigate('/my-creations')}
          className="flex items-center gap-2 text-xs font-mono text-[#ccc3d8] hover:text-white transition-colors bg-[#171b26] border border-[#1f2937] px-3 py-2 rounded-xl cursor-pointer"
        >
          <ArrowLeft size={13} /> Return to Fleet Matrix
        </button>
        <button 
          onClick={handleDecommission}
          className="flex items-center gap-1.5 text-xs font-mono text-[#ffafd3] hover:text-white transition-all bg-red-500/5 border border-red-500/10 px-3 py-2 rounded-xl cursor-pointer hover:bg-red-500/20"
        >
          <Trash2 size={13} /> Decommission Asset
        </button>
      </div>

      {/* MASTER RESPONSIVE GRID */}
      <motion.div 
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* ================= LEFT GRID: INTEL CHANNELS & SPECS (7/12 Spans) ================= */}
        <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Identity Card Layout */}
          <div className="glass-card bg-[#111827]/40 border border-[#1f2937] p-6 rounded-xl text-left space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="p-3 bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#d2bbff] rounded-xl shrink-0">
                  <Bot size={28} />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-heading text-white tracking-tight">{agentData.agentName}</h1>
                  <p className="text-xs font-mono text-[#ccc3d8] opacity-80 mt-0.5">Instance Index: <span className="text-[#4cd7f6]">{agentData._id}</span></p>
                </div>
              </div>

              {/* Functional Switch button */}
              <button 
                onClick={handleToggleState}
                className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                  agentData.status === 'active' 
                    ? 'border-[#4cd7f6]/20 bg-[#03b5d3]/10 text-[#4cd7f6]' 
                    : 'border-[#4a4455] bg-[#1c1f2a] text-[#ccc3d8]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${agentData.status === 'active' ? 'bg-[#4cd7f6] animate-pulse' : 'bg-[#4a4455]'}`} />
                {agentData.status.toUpperCase()}
              </button>
            </div>

            {/* Sub-Bento Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#0a0e18]/40 border border-[#1f2937] p-3 rounded-xl font-mono text-left">
                <span className="text-[9px] uppercase font-bold text-[#4a4455] block">Backbone Core</span>
                <span className="text-xs font-bold text-white block mt-1 truncate">{agentData.backboneModel}</span>
              </div>
              <div className="bg-[#0a0e18]/40 border border-[#1f2937] p-3 rounded-xl font-mono text-left">
                <span className="text-[9px] uppercase font-bold text-[#4a4455] block">Temperature</span>
                <span className="text-xs font-bold text-white block mt-1">{agentData.creativityTemperature}</span>
              </div>
              <div className="bg-[#0a0e18]/40 border border-[#1f2937] p-3 rounded-xl font-mono text-left">
                <span className="text-[9px] uppercase font-bold text-[#4a4455] block">Memory Track</span>
                <span className="text-xs font-bold text-[#d2bbff] block mt-1">{agentData.vectorMemoryEnabled ? 'Vector RAG' : 'Disabled'}</span>
              </div>
              <div className="bg-[#0a0e18]/40 border border-[#1f2937] p-3 rounded-xl font-mono text-left">
                <span className="text-[9px] uppercase font-bold text-[#4a4455] block">Forged Date</span>
                <span className="text-xs font-bold text-white block mt-1 truncate">{new Date(agentData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* 🌟 NEW SUITE: Whitelisted Origins Matrix Mapping Displays */}
            <div className="pt-2 border-t border-white/[0.04] text-left space-y-1.5">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] flex items-center gap-1.5">
                <Globe size={11} className="text-[#4cd7f6]" /> Whitelisted Deployment Environments
              </span>
              
              {!agentData.allowedOrigins || agentData.allowedOrigins.length === 0 ? (
                <div className="text-xs font-mono text-[#ccc3d8]/60 bg-[#0a0e18]/40 border border-[#1f2937] px-3 py-2 rounded-xl italic">
                  No strict restrictions configured. Sandboxed to local loop networks (<span className="text-zinc-400 font-mono">localhost</span>) exclusively.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {agentData.allowedOrigins.map((origin: string, index: number) => (
                    <div 
                      key={index} 
                      className="px-2.5 py-1 bg-[#03b5d3]/5 border border-[#03b5d3]/15 rounded-lg text-xs font-mono font-medium text-[#4cd7f6] flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#4cd7f6]" />
                      {origin}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Core Prompt Directive Readout */}
          <div className="glass-card bg-[#111827]/40 border border-[#1f2937] p-6 rounded-xl text-left space-y-3">
            <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center gap-2">
              <Sliders size={13} className="text-[#7c3aed]" /> Embedded Core System Directives
            </h3>
            <div className="bg-[#0a0e18] rounded-xl p-4 border border-[#1f2937] font-mono text-xs text-zinc-300 whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto custom-scrollbar text-left">
              {agentData.systemDirective}
            </div>
          </div>

          {/* Section 3: Vector Knowledge Attachment Vault */}
          <div className="glass-card bg-[#111827]/40 border border-[#1f2937] p-6 rounded-xl text-left space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center gap-2">
              <Database size={13} className="text-[#4cd7f6]" /> Associated Context Vector Arrays
            </h3>
            
            {associatedFiles.length === 0 ? (
              <p className="text-xs font-mono text-[#4a4455] italic p-4 border border-dashed border-[#1f2937] rounded-xl text-center">
                No direct document vectors mapped into this runtime memory. Using default model training sets.
              </p>
            ) : (
              <div className="space-y-2.5">
                {associatedFiles.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-3.5 bg-[#0a0e18]/50 border border-[#1f2937] rounded-xl font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[#4cd7f6]" />
                      <div>
                        <p className="text-white font-medium max-w-[240px] truncate">{file.fileName}</p>
                        <p className="text-[10px] text-[#4a4455] mt-0.5">Size: {(file.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      file.vectorIngestionStatus === 'PARSED' 
                        ? 'bg-[#03b5d3]/10 border-[#03b5d3]/20 text-[#4cd7f6]' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 ai-status-pulse'
                    }`}>
                      {file.vectorIngestionStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Embed Snippet Module */}
          <EmbedSnippetModule agentId={agentId || ""} />
        </motion.div>

        {/* ================= RIGHT COLUMN: INTERACTIVE STICKY LAUNCHER CANVAS (5/12 Spans) ================= */}
        <div className="lg:col-span-5 self-stretch w-full relative">
          <motion.div 
            variants={fadeInUp}
            className="sticky top-24 bg-[#111827]/10 border border-zinc-800/30 rounded-xl p-4 backdrop-blur-xs flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0e18] border border-[#1f2937] rounded-xl text-[11px] font-mono font-semibold">
              <button 
                type="button" onClick={() => setCanvasViewMode('minimized')} 
                className="py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors evaluation-btn"
                style={{
                  backgroundColor: canvasViewMode === 'minimized' ? '#4cd7f6' : 'transparent',
                  color: canvasViewMode === 'minimized' ? '#003640' : '#ccc3d8'
                }}
              >
                <ToggleLeft size={13} /> Launcher
              </button>
              <button 
                type="button" onClick={() => setCanvasViewMode('expanded')} 
                className="py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors evaluation-btn"
                style={{
                  backgroundColor: canvasViewMode === 'expanded' ? '#4cd7f6' : 'transparent',
                  color: canvasViewMode === 'expanded' ? '#003640' : '#ccc3d8'
                }}
              >
                <MessageSquare size={13} /> Open Window
              </button>
            </div>

            {/* THE LIVE ACCELERATED PREVIEW WINDOW */}
            <div className="w-full flex items-center justify-center py-4">
              <LiveChatPreview
                agentName={agentData.agentName}
                backboneModel={agentData.backboneModel}
                primaryColor={agentData.uiBranding?.primaryColor}
                secondaryColor={agentData.uiBranding?.secondaryColor}
                surfaceColor={agentData.uiBranding?.surfaceColor}
                borderRadius={agentData.uiBranding?.borderRadius}
                renderMode={canvasViewMode}
                launcherType={agentData.uiBranding?.launcherType}
                logoSource={agentData.uiBranding?.logoSource}
                selectedGlyph={agentData.uiBranding?.selectedGlyph}
                customLogoUrl={agentData.uiBranding?.customLogoUrl}
                isThinking={agentData.status === 'active'}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}