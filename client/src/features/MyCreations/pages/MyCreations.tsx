import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAgent } from '../../BuildAgent/hooks/useAgent'; 
import { 
  Layers, Bot, Play, Pause, Trash2, 
  Search, SlidersHorizontal, Zap, Database, RefreshCw
} from 'lucide-react';
import { GlowCard } from '../../../components/common/GlowCard';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';

export default function MyCreations() {
  const navigate = useNavigate();
  const { agents, fleetLoading, toggleAgentOperationalState, decommissionAgent } = useAgent();
  const [searchQuery, setSearchQuery] = useState('');

  // =========================================================================
  // ✧ INTERACTIVE EVENT DISPATCHERS
  // =========================================================================
  
  const handleToggleStatus = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // 👈 FIXED: Blocks master card redirection cascade instantly
    const res = await toggleAgentOperationalState(id);
    if (res.success) {
      toast.success(`${name} loop changed to state: ${res.status.toUpperCase()}`);
    } else {
      toast.error(res.message || "Failed to switch operational paths.");
    }
  };

  const handleDeleteAgent = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // 👈 FIXED: Blocks master card redirection cascade instantly
    if (confirm(`Are you completely sure you want to decommission ${name}? This will purge associated vector contexts and conversation loops.`)) {
      const res = await decommissionAgent(id);
      if (res.success) {
        toast.success(`${name} architecture has been cleared.`);
      } else {
        toast.error(res.message || "Decommission validation rejected.");
      }
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.backboneModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (fleetLoading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center font-mono text-xs text-[#4cd7f6]">
        <RefreshCw size={20} className="animate-spin mb-2 text-[#7c3aed]" />
        <span className="ai-status-pulse">Fetching Master Agent Forge Matrix...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-2 font-body pb-12 select-none">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 mt-4"
      >
        {/* ================= BLOCK 1: FILTER & CONTROLS HUD BAR ================= */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827]/30 border border-[#1f2937] p-4 rounded-xl backdrop-blur-xs">
          <div>
            <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
              <Layers size={16} className="text-[#7c3aed]" /> Master Cluster Forge Matrix
            </h2>
            <p className="text-xs text-[#ccc3d8]">Supervise, alter, and monitor your personalized running agent roster.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4455]" size={14} />
              <input 
                type="text"
                placeholder="Search cluster deployments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full sm:w-64 pl-9 pr-4 py-2 text-xs font-mono"
              />
            </div>
            <button className="p-2 bg-[#171b26] border border-[#1f2937] text-[#ccc3d8] hover:text-white rounded-xl transition-colors cursor-pointer">
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </motion.div>

        {/* ================= BLOCK 2: THE DEPLOYED AGENTS BLOCK GRID ================= */}
        {filteredAgents.length === 0 ? (
          <motion.div variants={fadeInUp} className="w-full border border-dashed border-[#1f2937] rounded-xl p-12 text-center bg-[#111827]/10">
            <Bot size={36} className="mx-auto text-[#4a4455] mb-3 animate-pulse" />
            <p className="text-xs font-mono text-[#ccc3d8]">No corresponding agent architecture arrays detected in cluster logs.</p>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgents.map((agent) => (
              <GlowCard 
                key={agent._id} 
                // ✅ FIXED: Entire box card surfaces click redirections straight to your deep monitoring panel
                className="bg-[#111827]/40 border border-[#1f2937] p-5 rounded-xl flex flex-col justify-between space-y-6 cursor-pointer hover:border-[#7c3aed]/40 transition-colors duration-300" 
                onClick={() => navigate(`/my-creations/${agent._id}`)}
              >
                
                {/* 1. Header Row Context Info */}
                <div className="w-full flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-heading text-white tracking-tight">{agent.agentName}</h3>
                      <span className="text-[9px] font-mono font-bold bg-[#171b26] border border-[#1f2937] text-[#ccc3d8] px-2 py-0.5 rounded truncate max-w-[80px]">
                        {agent._id}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#ccc3d8] opacity-80">{agent.backboneModel}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#0a0e18]/60 px-2.5 py-1 rounded-lg border border-white/5">
                    {agent.status === 'active' && (
                      <span className="text-[9px] font-mono text-[#4cd7f6] uppercase tracking-widest ai-status-pulse">Thinking</span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)]' : 'bg-[#4a4455]'}`} />
                  </div>
                </div>

                {/* 2. Parameters Specification Summary */}
                <div className="grid grid-cols-3 gap-2 bg-[#0a0e18]/40 border border-[#1f2937] p-3 rounded-xl text-left font-mono">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#4a4455] uppercase font-bold block">Memory</span>
                    <span className="text-xs text-[#d2bbff] font-semibold flex items-center gap-1">
                      <Database size={10} className="text-[#7c3aed]" /> {agent.vectorMemoryEnabled ? "Vector" : "Static"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#4a4455] uppercase font-bold block">Temperature</span>
                    <span className="text-xs text-white font-semibold">{agent.creativityTemperature}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#4a4455] uppercase font-bold block">Radius Sizing</span>
                    <span className="text-xs text-white font-semibold flex items-center gap-1">
                      <Zap size={10} className="text-[#4cd7f6]" /> {agent.uiBranding?.borderRadius ?? 16}px
                    </span>
                  </div>
                </div>

                {/* 3. Action Sequence Panel */}
                <div className="w-full pt-4 border-t border-[#4a4455]/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#4a4455]">
                    Deployed: <span className="text-[#ccc3d8]">{new Date(agent.createdAt).toLocaleDateString()}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Pause/Play Operations button */}
                    <button 
                      onClick={(e) => handleToggleStatus(e, agent._id, agent.agentName)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer relative z-20 ${
                        agent.status === 'active' 
                          ? 'border-[#ffafd3]/20 bg-[#ae397b]/10 text-[#ffafd3] hover:bg-[#ae397b]/20' 
                          : 'border-[#4cd7f6]/20 bg-[#03b5d3]/10 text-[#4cd7f6] hover:bg-[#03b5d3]/20'
                      }`}
                      title={agent.status === 'active' ? "Halt Operation" : "Resume Operation"}
                    >
                      {agent.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                    </button>

                    {/* Trash Decommission button */}
                    <button 
                      onClick={(e) => handleDeleteAgent(e, agent._id, agent.agentName)}
                      className="p-2 border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/20 hover:text-white rounded-xl transition-all cursor-pointer relative z-20"
                      title="Decommission Pipeline Asset"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </GlowCard>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}