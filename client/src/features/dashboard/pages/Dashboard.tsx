import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Activity, Zap, Layers, Play, Pause, Plus,
  Terminal, ShieldCheck, RefreshCw, Radio, Loader2,
  HelpCircle
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';
import { GlowCard } from '../../../components/common/GlowCard';
import { useGlobalNavigate } from '../../../hooks/NavigationProvider';
import useDashboard, { type AgentData } from '../hooks/useDashboard';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warn';
  message: string;
}

const Dashboard = () => {
  const navigate = useGlobalNavigate();
  
  // Consume cluster metrics and agent workforce list dynamically from our hook
  const { metrics, agents, setAgents, loading, error } = useDashboard();

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '18:00:01', type: 'info', message: 'Establishing secure websocket handshakes with core agent nodes...' },
    { timestamp: '18:00:03', type: 'info', message: 'Loading custom vector embedding databases into active workspace lines.' },
    { timestamp: '18:00:05', type: 'success', message: 'System telemetry handshake initialized successfully. Listening for tasks.' }
  ]);

  // Map icons dynamically to matches calculated type parameters returned from controller payload
  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'workers': return Cpu;
      case 'efficiency': return Zap;
      case 'tokens': return Layers;
      case 'latency': return Activity;
      default: return Cpu;
    }
  };

  // Simulate incoming real-time logging stream activity
  useEffect(() => {
    if (agents.length === 0) return;

    const logInterval = setInterval(() => {
      const activeAgents = agents.filter(a => a.status === 'active');
      if (activeAgents.length === 0) return;

      const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      const events = [
        `Executed vector RAG query routine inside ${randomAgent.name} database mapping.`,
        `Ingested context handshake payload for ${randomAgent.name} engine pipeline.`,
        `Refreshed background intelligence status token securely.`
      ];

      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];

      setLogs(prev => [
        ...prev.slice(-4), // Keep screen footprint low
        { timestamp: timeString, type: 'info', message: events[Math.floor(Math.random() * events.length)] }
      ]);
    }, 4000);

    return () => clearInterval(logInterval);
  }, [agents]);

  // Handle local active worker execution toggling
  const toggleAgentStatus = (id: string) => {
    setAgents((prev: AgentData[]) => prev.map(agent => {
      if (agent.id === id) {
        const nextStatus = agent.status === 'active' ? 'paused' : 'active';

        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        setLogs(l => [
          ...l,
          {
            timestamp: timeString,
            type: nextStatus === 'active' ? 'success' : 'warn',
            message: `User intervention: ${agent.name} status shifted explicitly to [${nextStatus.toUpperCase()}].`
          }
        ]);

        return { ...agent, status: nextStatus };
      }
      return agent;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center font-mono text-xs text-[#4cd7f6]">
        <Loader2 size={24} className="animate-spin mb-3 text-[#7c3aed]" />
        <span>SYNCING OPERATIONAL DATA SUBSYSTEMS...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center font-mono text-xs text-red-400 p-6 text-center">
        <Terminal size={24} className="mb-2 text-red-500 animate-pulse" />
        <span className="font-bold uppercase tracking-wider block mb-1">Matrix Connection Aborted</span>
        <span className="text-zinc-500 max-w-sm">{error}</span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8 mt-4"
      >
        {/* ================= BLOCK 1: TELEMETRY ROW GRADIENT TRACKER ================= */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, i) => {
            const IconComponent = getMetricIcon(metric.type);
            return (
              <GlowCard key={i} className="!p-5 bg-[#111827]/30">
                <div className="flex justify-between items-start w-full">
                  <p className="text-[11px] font-mono font-semibold text-[#ccc3d8] uppercase tracking-wider">{metric.label}</p>
                  <div className="p-2 bg-[#171b26] border border-[#4a4455]/40 rounded-lg text-[#4cd7f6]">
                    <IconComponent size={16} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-4 w-full">
                  <span className="text-2xl font-bold font-heading text-white tracking-tight">{metric.value}</span>
                  <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${metric.label.includes('Workers') ? 'text-[#4cd7f6] bg-[#03b5d3]/10' : 'text-[#ffafd3] bg-[#ae397b]/10'}`}>
                    {metric.change}
                  </span>
                </div>
              </GlowCard>
            );
          })}
        </motion.div>

        {/* ================= BLOCK 2: INTERACTIVE FLEET DEPLOYMENT MANAGEMENT ================= */}
        <motion.div variants={fadeInUp} className="space-y-4 mt-12">
          <div className="mb-10 w-full h-px bg-gradient-to-r from-transparent via-[#4cd7f6]/40 to-transparent" />
          <div className="flex justify-between items-center px-1">
            <div>
              <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
                <Radio size={16} className="text-[#7c3aed] animate-pulse" /> Running Agent Workforce Fleet ({agents.length})
              </h2>
              <p className="text-xs text-[#ccc3d8] font-body">Deploy, pause, and supervise live cluster nodes instantly.</p>
            </div>
            <button className="btn-primary !px-4 !py-2 !rounded-xl text-xs flex items-center gap-1.5 cursor-pointer" onClick={()=>{navigate('/build-agent')}}>
              <Plus size={14} /> Forge New Agent
            </button>
          </div>

          {agents.length === 0 ? (
            <div className="h-40 border border-dashed border-[#1f2937] rounded-xl flex flex-col items-center justify-center text-zinc-500 text-xs font-mono">
              <HelpCircle size={20} className="mb-2 text-zinc-600" />
              No Operational Workers Deployed inside Cluster Line.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <GlowCard key={agent.id} className="min-h-[200px] bg-[#111827]/40 border border-[#1f2937] flex flex-col justify-between">
                  <div className="w-full">
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="text-[10px] font-mono bg-[#171b26] text-[#ccc3d8] border border-[#4a4455]/40 px-2 py-0.5 rounded uppercase tracking-wider">
                        {agent.useCase}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {agent.status === 'active' && (
                          <span className="text-[9px] font-mono text-[#4cd7f6] uppercase tracking-widest ai-status-pulse">Thinking</span>
                        )}
                        <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)]' : 'bg-[#4a4455]'}`} />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">{agent.name}</h3>
                    <p className="text-xs text-[#ccc3d8] font-body font-mono opacity-80">{agent.model}</p>
                  </div>

                  <div className="w-full pt-4 border-t border-[#4a4455]/20 flex items-center justify-between mt-4">
                    <div className="font-mono text-xs text-[#ccc3d8]">
                      Node Accuracy: <span className="text-[#d2bbff] font-bold">{agent.efficiency.toFixed(1)}%</span>
                    </div>

                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${agent.status === 'active'
                        ? 'border-[#ffafd3]/20 bg-[#ae397b]/10 text-[#ffafd3] hover:bg-[#ae397b]/20'
                        : 'border-[#4cd7f6]/20 bg-[#03b5d3]/10 text-[#4cd7f6] hover:bg-[#03b5d3]/20'
                        }`}
                      title={agent.status === 'active' ? "Halt Operational Pipeline" : "Resume Operations"}
                    >
                      {agent.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}
          <div className="mt-10 w-full h-px bg-gradient-to-r from-transparent via-[#4cd7f6]/40 to-transparent" />
        </motion.div>

        {/* ================= BLOCK 3: LIVE EVENT CONSOLE TERMINAL ================= */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="px-1">
            <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
              <Terminal size={16} className="text-[#4cd7f6]" /> Live Intelligence Flux Terminal Stream
            </h2>
            <p className="text-xs text-[#ccc3d8] font-body">Real-time compilation readouts from active memory pipelines.</p>
          </div>

          <div className="bg-[#0a0e18] border border-[#1f2937] rounded-xl p-5 font-mono text-xs space-y-3 shadow-inner h-56 overflow-y-auto custom-scrollbar flex flex-col justify-between">
            <div className="space-y-2.5">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4 leading-relaxed text-[#ccc3d8] items-start">
                  <span className="text-[#4a4455] select-none shrink-0 font-semibold">{log.timestamp}</span>
                  <p className={log.type === 'success' ? 'text-[#4cd7f6]' : log.type === 'warn' ? 'text-[#ffafd3]' : 'text-[#dfe2f1]'}>
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#171b26]/60 rounded-lg p-2.5 border border-white/5 flex items-center justify-between font-sans text-[11px] mt-4 shrink-0 text-[#ccc3d8]">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#4cd7f6]" /> Sandbox Environment Guard Secure</span>
              <span className="flex items-center gap-1 text-[#4cd7f6] font-mono text-[10px] uppercase tracking-wider"><RefreshCw size={11} className="animate-spin" /> Listening for data arrays</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;