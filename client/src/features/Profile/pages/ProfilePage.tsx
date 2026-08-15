import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, ShieldCheck, Cpu, Terminal, Building, 
  Briefcase, Zap, Edit3, Save, X, Loader2, Camera, Calendar, 
  HelpCircle, Bot, Activity, Layers, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useProfileContext } from '../profileContext';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';

export default function ProfilePage() {
  const { profile, loading, updating, error, updateProfile } = useProfileContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Interactive local states for mutations and instant asset previews
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    organizationName: '',
    TargetClassification: ''
  });

  // Track the currently active sliding index for the agent settings array matrix
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);

  // Sync state parameters cleanly whenever incoming server matrix values shift
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        organizationName: profile.organizationName || '',
        TargetClassification: profile.TargetClassification || ''
      });
      setPreviewUrl(profile.profilePictureUrl || null);
    }
  }, [profile]);

  // Safe normalization of array bindings
  const agentList = Array.isArray(profile?.agentSettings) ? profile.agentSettings : profile?.agentSettings ? [profile.agentSettings] : [];
  const currentAgent = agentList[activeAgentIndex];

  const handleNextAgent = () => {
    setActiveAgentIndex((prev) => (prev + 1) % agentList.length);
  };

  const handlePrevAgent = () => {
    setActiveAgentIndex((prev) => (prev - 1 + agentList.length) % agentList.length);
  };

  // AUTOMATIC TIMED CAROUSEL SCROLL HOOK
  useEffect(() => {
    // Only spin up interval clock cycles if multiple pipelines exist
    if (agentList.length <= 1 || isEditing) return;

    const autoScrollTimer = setInterval(() => {
      handleNextAgent();
    }, 4000); // 4000ms execution cadence loop

    // Flush active tracker thread instances upon unmounting or variable shifting events
    return () => clearInterval(autoScrollTimer);
  }, [agentList.length, activeAgentIndex, isEditing]);

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center font-mono text-xs text-[#4cd7f6] bg-[#030712]/20 rounded-2xl border border-[#1f2937]/30 backdrop-blur-md">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 border-2 border-[#7c3aed] border-t-transparent rounded-full mb-4 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        />
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          LOADING SECURE OPERATOR PROFILE MATRIX...
        </motion.span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center font-mono text-xs text-red-400 bg-red-950/10 border border-red-900/30 rounded-2xl backdrop-blur-md p-6 text-center">
        <Terminal size={24} className="mb-2 text-red-500 animate-pulse" />
        <span className="font-bold uppercase tracking-wider mb-1">Security Authentication Failure</span>
        <span className="text-zinc-500 max-w-sm">{error || "No configuration context layout detected."}</span>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append('fullName', formData.fullName);
      submissionData.append('organizationName', formData.organizationName);
      submissionData.append('TargetClassification', formData.TargetClassification);
      
      if (selectedFile) {
        submissionData.append('profilePicture', selectedFile);
      }

      await updateProfile(submissionData);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Matrix execution compilation failed: ", err);
    }
  };

  return (
    <div className="h-full w-full font-body pb-16 text-left select-none relative overflow-hidden">
      
      {/* Decorative cyber grid lines behind elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* HEADER CONTROL SYSTEM NODE */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#111827]/40 border border-[#1f2937]/80 p-5 rounded-2xl mb-8 backdrop-blur-md gap-4 relative z-10"
      >
        <div className="space-y-1">
          <h2 className="text-sm font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} className="text-[#4cd7f6] drop-shadow-[0_0_5px_#4cd7f6]" /> Profile Configuration Node
          </h2>
          <p className="text-[11px] font-mono text-zinc-500">Identity Identifier: <span className="text-zinc-400 select-all font-semibold">{profile._id}</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {profile.isVerified && (
            <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md uppercase font-bold tracking-wider flex items-center gap-1 shadow-[inset_0_0_8px_rgba(16,185,129,0.05)]">
              <ShieldCheck size={11} /> Verified Core
            </span>
          )}
          {profile.isActive && !profile.isSuspended ? (
            <span className="text-[10px] font-mono bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 text-[#4cd7f6] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider flex items-center gap-1">
              <Activity size={11} className="animate-pulse" /> Channel Active
            </span>
          ) : (
            <span className="text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
              Terminated
            </span>
          )}
          <span className="text-[10px] font-mono bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#a78bfa] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
            {profile.WorkSpaceType} Network
          </span>
        </div>
      </motion.div>

      {/* COMPREHENSIVE BENTO GRAPH MATRIX */}
      <motion.div 
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10"
      >
        {/* CARD 1: CORE BIOMETRIC / PICTURE VECTOR (4/12 Scale Layout) */}
        <motion.div variants={fadeInUp} className="md:col-span-4 lg:col-span-4 h-full">
          <div className="h-full bg-[#111827]/30 border border-[#1f2937] p-6 rounded-2xl flex flex-col items-center text-center justify-between relative overflow-hidden backdrop-blur-md group hover:border-[#7c3aed]/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7c3aed]/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="w-full flex flex-col items-center">
              <div className="relative w-28 h-28 mb-5 group/avatar">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] rounded-2xl blur-xs opacity-40 group-hover/avatar:opacity-80 transition-opacity duration-300" />
                <div className="absolute inset-0.5 rounded-2xl bg-[#0a0e18] overflow-hidden flex items-center justify-center border border-[#1f2937] relative z-10">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt={profile.fullName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#111827] text-[#d2bbff]">
                      <User size={44} className="opacity-70 group-hover/avatar:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {isEditing && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                      className="absolute inset-0.5 rounded-2xl bg-black/70 flex flex-col items-center justify-center gap-1 text-xs text-[#4cd7f6] font-mono font-bold cursor-pointer z-20 hover:text-white transition-colors"
                    >
                      <Camera size={18} className="animate-pulse text-[#4cd7f6]" />
                      <span className="text-[9px] uppercase tracking-widest">Inject Asset</span>
                    </motion.button>
                  )}
                </AnimatePresence>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <h1 className="text-xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
                {profile.fullName}
              </h1>
              <p className="text-xs font-mono text-[#4cd7f6] mt-1 bg-[#4cd7f6]/5 border border-[#4cd7f6]/10 px-2.5 py-0.5 rounded-md">
                @{profile.username}
              </p>
            </div>

            <div className="w-full mt-8 pt-4 border-t border-[#1f2937]/50 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="flex items-center gap-1.5"><Layers size={12} /> Plan Index</span>
                <span className="text-white font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{profile.SubscriptionPlan}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span className="flex items-center gap-1.5"><Shield size={12} /> Security Protocol</span>
                <span className="text-[#a78bfa] font-semibold">{profile.role === 'ORGANIZATION_ADMIN' ? 'Org Administrator' : profile.role}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: EDITABLE IDENTITY MODIFICATION FIELD VECTOR (8/12 Span) */}
        <motion.div variants={fadeInUp} className="md:col-span-8 lg:col-span-8">
          <div className="bg-[#111827]/30 border border-[#1f2937] p-6 rounded-2xl relative overflow-hidden backdrop-blur-md hover:border-[#1f2937] transition-all duration-300">
            
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#1f2937]/50">
              <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center gap-2">
                <User size={13} className="text-[#7c3aed]" /> Core Node Specifications
              </h3>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-[11px] font-mono font-bold rounded-lg border border-[#1f2937] hover:border-[#4cd7f6]/50 bg-[#0a0e18]/80 text-[#ccc3d8] hover:text-[#4cd7f6] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={12} /> Modify Parameters
                </button>
              ) : (
                <button 
                  onClick={() => { 
                    setIsEditing(false); 
                    setPreviewUrl(profile.profilePictureUrl || null); 
                    setSelectedFile(null); 
                  }}
                  className="px-3 py-1 text-[11px] font-mono font-bold rounded-lg border border-red-900/30 hover:border-red-500/50 bg-red-950/20 text-red-400 hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={12} /> Abort Mutation
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateAssignment} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <User size={12} className="text-[#7c3aed]" /> Full Name Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0a0e18]/80 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-[#7c3aed] transition-colors focus:ring-1 focus:ring-[#7c3aed]/20"
                    required
                  />
                ) : (
                  <div className="text-zinc-300 text-xs font-mono bg-[#0a0e18]/40 border border-[#1f2937]/30 px-3 py-2 rounded-xl">{profile.fullName}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <Mail size={12} className="text-zinc-500" /> Comm Route (Immutable)
                </label>
                <div className="text-zinc-500 text-xs font-mono bg-[#0a0e18]/60 px-3 py-2 rounded-xl border border-[#1f2937]/20 truncate flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {profile.email}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <Building size={12} className="text-[#4cd7f6]" /> Corporate Hive / Org
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full bg-[#0a0e18]/80 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-[#7c3aed] transition-colors focus:ring-1 focus:ring-[#7c3aed]/20"
                  />
                ) : (
                  <div className="text-zinc-300 text-xs font-mono bg-[#0a0e18]/40 border border-[#1f2937]/30 px-3 py-2 rounded-xl">{profile.organizationName || 'N/A'}</div>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <Briefcase size={12} className="text-amber-500" /> Focus Allocation Classification
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.TargetClassification}
                    onChange={(e) => setFormData({ ...formData, TargetClassification: e.target.value })}
                    className="w-full bg-[#0a0e18]/80 border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-[#7c3aed] transition-colors focus:ring-1 focus:ring-[#7c3aed]/20"
                  />
                ) : (
                  <div className="text-zinc-300 text-xs font-mono bg-[#0a0e18]/40 border border-[#1f2937]/30 px-3 py-2 rounded-xl">{profile.TargetClassification || 'N/A'}</div>
                )}
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="sm:col-span-2 flex justify-end gap-2.5 pt-2 border-t border-[#1f2937]/50"
                  >
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <Loader2 size={13} className="animate-spin" /> Patching Core Matrix...
                        </>
                      ) : (
                        <>
                          <Save size={13} /> Commit Config Changes
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* CARD 3: RESOURCE QUOTA MONITOR GRID INFRASTRUCTURE (6/12 Scale Layout) */}
        <motion.div variants={fadeInUp} className="md:col-span-6 lg:col-span-6 h-full">
          <div className="h-full bg-[#111827]/30 border border-[#1f2937] p-6 rounded-2xl space-y-4 backdrop-blur-md">
            <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center gap-2">
              <Cpu size={13} className="text-[#7c3aed]" /> Operational Bandwidth Quotas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0a0e18]/50 border border-[#1f2937] p-4 rounded-xl font-mono relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#7c3aed]/5 blur-xl rounded-full" />
                <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-wider">
                  Agent Building Assets
                </span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#a78bfa] transition-colors">
                    {profile.agentCreationToken.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase ml-0.5">Tokens</span>
                </div>
                <div className="w-full bg-[#1f2937] h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#7c3aed] h-full rounded-full" style={{ width: `${Math.min((profile.agentCreationToken / 1000) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="bg-[#0a0e18]/50 border border-[#1f2937] p-4 rounded-xl font-mono relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#4cd7f6]/5 blur-xl rounded-full" />
                <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-wider flex items-center gap-1">
                  <Zap size={10} className="text-[#4cd7f6]" /> Compute Executions
                </span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-2xl font-bold tracking-tight text-[#4cd7f6]">
                    {profile.chatExecutionToken.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase ml-0.5">Calls</span>
                </div>
                <div className="w-full bg-[#1f2937] h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: MULTI-AGENT SUB-TELEMETRY CAROUSEL CORE WITH AUTO-SCROLL */}
        <motion.div variants={fadeInUp} className="md:col-span-6 lg:col-span-6 h-full">
          <div className="h-full bg-[#111827]/30 border border-[#1f2937] p-6 rounded-2xl space-y-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#4cd7f6]/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold font-mono text-[#ccc3d8] uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bot size={13} className="text-[#4cd7f6]" /> 
                  Workspace Cores Pipeline ({agentList.length})
                </span>
                
                {/* Micro Sliding Directional Controllers */}
                {agentList.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handlePrevAgent}
                      className="p-1 rounded bg-[#0a0e18] border border-[#1f2937] text-zinc-400 hover:text-[#4cd7f6] hover:border-[#4cd7f6]/30 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button 
                      onClick={handleNextAgent}
                      className="p-1 rounded bg-[#0a0e18] border border-[#1f2937] text-zinc-400 hover:text-[#4cd7f6] hover:border-[#4cd7f6]/30 transition-all cursor-pointer"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </h3>

              {currentAgent ? (
                <div className="relative min-h-[140px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAgent._id || activeAgentIndex}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 font-mono text-xs w-full"
                    >
                      <div className="bg-[#0a0e18]/40 border border-[#1f2937]/60 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/20 flex items-center justify-center text-[#4cd7f6] shrink-0">
                            <Bot size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-bold text-xs truncate">{currentAgent.agentName}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">Core Index Model</div>
                          </div>
                        </div>
                        
                        <span className={`text-[9px] px-2 py-0.5 rounded border ml-2 shrink-0 tracking-widest uppercase ${
                          currentAgent.status === 'active' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                        }`}>
                          {currentAgent.status || 'paused'}
                        </span>
                      </div>

                      <div className="bg-[#0a0e18]/20 p-2.5 border border-[#1f2937]/40 rounded-lg flex justify-between items-center text-[11px]">
                        <span className="text-zinc-500 text-[10px] uppercase">Backbone Model Vector</span>
                        <span className="text-zinc-300 max-w-[200px] truncate text-right">{currentAgent.backboneModel || 'N/A'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div className="bg-[#0a0e18]/20 p-2.5 border border-[#1f2937]/40 rounded-lg flex flex-col justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1"><Cpu size={10} /> Vector Memory</span>
                          <span className={`font-bold uppercase mt-1 text-xs ${currentAgent.vectorMemoryEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {currentAgent.vectorMemoryEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <div className="bg-[#0a0e18]/20 p-2.5 border border-[#1f2937]/40 rounded-lg flex flex-col justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1"><Calendar size={10} /> Sync Date</span>
                          <span className="text-zinc-300 font-medium mt-1 text-[10px] truncate">
                            {currentAgent.createdAt ? new Date(currentAgent.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="h-28 border border-dashed border-[#1f2937] rounded-xl flex flex-col items-center justify-center text-zinc-500 text-xs font-mono">
                  <HelpCircle size={16} className="mb-1 text-zinc-600" />
                  No Core Agent Bound to Workspace
                </div>
              )}
            </div>

            {/* Matrix Pagination Dot Matrix Indicators */}
            {agentList.length > 1 && (
              <div className="flex justify-center items-center gap-1 pt-2 border-t border-[#1f2937]/30 w-full">
                {agentList.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setActiveAgentIndex(dotIndex)}
                    className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
                      dotIndex === activeAgentIndex ? 'w-4 bg-[#4cd7f6]' : 'w-1 bg-[#1f2937] hover:bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}