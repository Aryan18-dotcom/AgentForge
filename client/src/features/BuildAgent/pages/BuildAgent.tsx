import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAgent } from '../hooks/useAgent';
import {
    Sliders, Sparkles, Settings2, Database,
    FileText, Code2, UploadCloud, Trash2,
    Paintbrush, ChevronRight, ArrowLeft, MessageSquare,
    ToggleLeft, Bot, Terminal, Image, X, Eye, Globe, AlertTriangle, Lock
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';
import LiveChatPreview from '../../../components/dashboard-components/LiveChatPreview';
import CustomeLoader from '../../../components/common/CustomeLoader';
import LiveInteractionPreview from '../../../components/dashboard-components/LiveInteractionPreview';
import { useAuth } from '../../auth/hooks/useAuth';

interface AgentConfig {
    agentId?: string;
    agentName: string;
    backboneModel: string;
    creativityTemperature: number;
    systemDirective: string;
    vectorMemory: boolean;
    allowedDomains: string; 
    primaryColor: string;
    secondaryColor: string;
    surfaceColor: string;
    borderRadius: number;
    launcherType: 'icon' | 'text' | 'combined';
    launcherText: string;
    logoSource: 'glyph' | 'custom';
    selectedGlyph: 'sparkle' | 'bot' | 'terminal';
    customLogoUrl: string | null;
    hoverAnimation: 'none' | 'expand-text' | 'pulse-glow' | 'bounce';
    hoverSpeed: number;
    chatOpenAnimation: 'pop-in' | 'slide-up' | 'fade-in';
    chatCloseAnimation: 'scale-out' | 'slide-down' | 'fade-out';
    chatTransitionSpeed: number;
    entranceAnimation: 'fade-in' | 'slide-up' | 'pop-in';
    entranceSpeed: 'slow' | 'normal' | 'fast';
    entranceDelayDuration: number;
}

export default function BuildAgent() {
    const navigate = useNavigate();
    const { forgeAgent, actionLoading } = useAgent();
    const { user, loading } = useAuth();
    console.log(user)

    const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
    const [directiveSource, setDirectiveSource] = useState<'textarea' | 'file'>('textarea');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [canvasViewMode, setCanvasViewMode] = useState<'minimized' | 'expanded'>('expanded');
    const [hasVectorAccess, setHasVectorAccess] = useState<true | false>(false);
    const [canBuildAgent, setCanBuildAgent] = useState<true | false>(false);
    const [allowedOriginNumber, setAllowedOriginNumber] = useState<number | null>(null);

    useEffect(() => {
        const setSettingsForUser = () => {
            if (user) {
                // Fixed conditional matching logic to evaluate against strict premium tiers
                if (user.SubscriptionPlan !== "Free" && user.SubscriptionPlan !== "Starter") {
                    setHasVectorAccess(true);
                } else {
                    setHasVectorAccess(false);
                }

                if (user.agentCreationToken > 0) {
                    setCanBuildAgent(true);
                } else {
                    setCanBuildAgent(false);
                }

                if (user.SubscriptionPlan === "Starter") {
                    setAllowedOriginNumber(1);
                } else if (user.SubscriptionPlan === "Growth") {
                    setAllowedOriginNumber(2);
                } else if (user.SubscriptionPlan === "Experience") {
                    setAllowedOriginNumber(4);
                } else {
                    setAllowedOriginNumber(0); // Free tier baseline
                }
            }
        };

        setSettingsForUser();
    }, [user]);

    const [config, setConfig] = useState<AgentConfig>({
        agentName: 'Research-Bot-Delta',
        backboneModel: 'professional',
        creativityTemperature: 0.7,
        systemDirective: 'You are Research-Bot-Delta, an advanced market research specialist asset trained to parse corporate data arrays.',
        vectorMemory: false, // Default to false to honor free-tier validation restrictions safely
        allowedDomains: '', 
        primaryColor: '#7c3aed',
        secondaryColor: '#4cd7f6',
        surfaceColor: '#111827',
        borderRadius: 16,
        launcherType: 'combined',
        launcherText: 'Chat with Research-Bot-Delta',
        logoSource: 'glyph',
        selectedGlyph: 'sparkle',
        customLogoUrl: null,
        hoverAnimation: 'expand-text',
        hoverSpeed: 0.3,
        chatOpenAnimation: 'pop-in',
        chatCloseAnimation: 'scale-out',
        chatTransitionSpeed: 0.4,
        entranceAnimation: 'slide-up',
        entranceSpeed: 'normal',
        entranceDelayDuration: 0.5
    });

    // Helper calculation framework to read actively configured inputs count dynamically
    const currentOriginsCount = config.allowedDomains.trim() === '' 
        ? 0 
        : config.allowedDomains.split(',').map(d => d.trim()).filter(Boolean).length;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => {
            const updated = {
                ...prev,
                [name]: name.includes('borderRadius') ||
                    name.includes('creativityTemperature') ||
                    name.includes('hoverSpeed') ||
                    name.includes('chatTransitionSpeed') ||
                    name.includes('entranceDelayDuration')
                    ? parseFloat(value)
                    : value
            };
            if (name === 'agentName' && directiveSource === 'textarea') {
                updated.systemDirective = `You are ${value}, an advanced market research specialist asset trained to parse corporate data arrays.`;
            }
            if (name === 'agentName') {
                updated.launcherText = `Chat with ${value}`;
            }
            return updated;
        });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setConfig(prev => ({ ...prev, customLogoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
        }
    };

    const clearCustomLogo = () => setConfig(prev => ({ ...prev, customLogoUrl: null }));
    const removeFile = () => {
        setUploadedFile(null);
        setConfig(prev => ({ ...prev, systemDirective: '' }));
    };

    const readFileContentAsync = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string || "");
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    const handleInitializeForge = async (e: React.FormEvent) => {
        e.preventDefault();

        // Extra layout execution security guard checks
        if (allowedOriginNumber !== null && currentOriginsCount > allowedOriginNumber) {
            toast.error(`Domain count boundary restriction breached. Please limit allocation parameters to ${allowedOriginNumber} units.`);
            return;
        }

        let underlyingSchemaModel = 'Professional (Analytical, Corporate, Direct)';
        let personaPrefix = "";
        switch (config.backboneModel) {
            case 'professional':
                underlyingSchemaModel = 'Professional (Analytical, Corporate, Direct)';
                personaPrefix = "Maintain a formal corporate tone. ";
                break;
            case 'friendly':
                underlyingSchemaModel = 'Friendly (Approachable, Empathetic, Engaging)';
                personaPrefix = "Be warm, empathetic, and approachable. ";
                break;
            case 'creative':
                underlyingSchemaModel = 'Creative (Brainstorming, Bold, Conversational)';
                personaPrefix = "Adopt an expressive, out-of-the-box stance. ";
                break;
            case 'technical':
                underlyingSchemaModel = 'Technical Support (Code-Fluent, Diagnostic, Precise)';
                personaPrefix = "Prioritize precise code syntax rules. ";
                break;
        }

        let calculatedDirectivePayload = "";
        if (directiveSource === 'file' && uploadedFile) {
            try {
                const fileRawContent = await readFileContentAsync(uploadedFile);
                calculatedDirectivePayload = `${personaPrefix}Formated Context Instrcutions :-\n Your name is ${config.agentName}.\n\n${fileRawContent.trim()}`;
            } catch (err) {
                console.error("Failed to compile text context:", err);
                toast.error("Error formatting uploaded context document.");
                return;
            }
        } else {
            calculatedDirectivePayload = `${personaPrefix}${config.systemDirective}`.trim();
        }

        const formData = new FormData();
        formData.append("agentName", config.agentName);
        formData.append("backboneModel", underlyingSchemaModel);
        formData.append("creativityTemperature", config.creativityTemperature.toString());
        formData.append("systemDirective", calculatedDirectivePayload);
        
        // Pass sanitized array back to server via formatting standards
        const cleanedDomainsArray = config.allowedDomains
            .split(',')
            .map(d => d.trim())
            .filter(Boolean);
        formData.append("allowedDomains", JSON.stringify(cleanedDomainsArray));
        formData.append("vectorMemoryEnabled", (hasVectorAccess && config.vectorMemory).toString());

        formData.append("uiBranding", JSON.stringify({
            primaryColor: config.primaryColor,
            secondaryColor: config.secondaryColor,
            surfaceColor: config.surfaceColor,
            borderRadius: config.borderRadius,
            launcherType: config.launcherType,
            launcherText: config.launcherText,
            logoSource: config.logoSource,
            selectedGlyph: config.selectedGlyph,
            customLogoUrl: config.customLogoUrl,
            hoverAnimation: config.hoverAnimation,
            hoverSpeed: config.hoverSpeed,
            chatOpenAnimation: config.chatOpenAnimation,
            chatCloseAnimation: config.chatCloseAnimation,
            chatTransitionSpeed: config.chatTransitionSpeed,
            entranceAnimation: config.entranceAnimation,
            entranceSpeed: config.entranceSpeed,
            entranceDelayDuration: config.entranceDelayDuration
        }));

        if (uploadedFile) {
            formData.append("contextFile", uploadedFile);
        }

        const result = await forgeAgent(formData) as { success: boolean; message: string; agent?: any };

        if (result.success) {
            toast.success("Pipeline array successfully mounted!");
            if (result.agent?._id) {
                navigate(`/my-creations/${result.agent._id}`);
            } else {
                navigate('/my-creations');
            }
        } else {
            toast.error(result.message || "Compilation loop breakdown encountered.");
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full font-body grid grid-cols-1 lg:grid-cols-12 gap-8 relative select-none"
        >
            {/* ================= LEFT COLUMN: CONTROL TRAY ================= */}
            <motion.div variants={fadeInUp} className="lg:col-span-7">
                <AnimatePresence>
                    {(actionLoading || loading) && <CustomeLoader />}
                </AnimatePresence>

                {!canBuildAgent && !loading ? (
                    /* ⚠️ TOKEN SECURITY LOCKOUT VIEW INTERFACE */
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card bg-red-500/5 border border-red-500/20 p-8 text-center rounded-xl space-y-4 flex flex-col items-center justify-center min-h-[400px]"
                    >
                        <div className="h-12 w-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center rounded-xl text-red-400">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-white">Insufficient Forging Tokens Detected</h3>
                        <p className="text-xs text-[#ccc3d8] max-w-sm mx-auto leading-relaxed">
                            Your active account context limits have run out of agent creation tokens. Purchase assets inside the subscription panel to resume pipeline development.
                        </p>
                        <Link 
                            to="/subscription" 
                            className="btn-primary py-3 px-6 text-xs font-heading rounded-xl cursor-pointer font-bold inline-flex items-center gap-2 mt-2 shadow-lg shadow-purple-500/20"
                        >
                            <Sparkles size={14} /> View Subscription Pipelines
                        </Link>
                    </motion.div>
                ) : (
                    /* STANDARD OPERATION CREATION CONTAINER INTERFACE */
                    <form onSubmit={handleInitializeForge} className="glass-card bg-[#111827]/40 border border-[#1f2937] p-6 space-y-6 rounded-xl">

                        {/* Progress Segment Bar */}
                        <div className="flex justify-between items-center bg-[#0a0e18]/40 border border-[#1f2937] p-2.5 rounded-xl font-mono text-xs">
                            <span className="font-bold text-[#ccc3d8] flex items-center gap-1.5">
                                <span className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${currentPhase === 1 ? 'bg-[#7c3aed] text-white' : 'bg-[#1c1f2a]'}`}>1</span>
                                Logic Matrix
                            </span>
                            <ChevronRight size={12} className="text-[#4a4455]" />
                            <span className="font-bold text-[#ccc3d8] flex items-center gap-1.5">
                                <span className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${currentPhase === 2 ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#1c1f2a]'}`}>2</span>
                                Branding Tokens
                            </span>
                            <ChevronRight size={12} className="text-[#4a4455]" />
                            <span className="font-bold text-[#ccc3d8] flex items-center gap-1.5">
                                <span className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] ${currentPhase === 3 ? 'bg-amber-400 text-black' : 'bg-[#1c1f2a]'}`}>3</span>
                                Interaction Mechanics
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* PHASE 1: LOGIC CODE BLOCKS */}
                            {currentPhase === 1 && (
                                <motion.div key="phase1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-sm font-bold text-white font-heading tracking-tight flex items-center gap-2"><Sliders size={14} className="text-[#7c3aed]" /> Step 1: Base Directives</h3>
                                        <p className="text-[11px] text-[#ccc3d8]">Configure pipeline identity, neural model weightings, and knowledge context.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">Agent Custom Name</label>
                                            <input type="text" name="agentName" value={config.agentName} onChange={handleInputChange} className="input-dark w-full px-4 py-3 text-xs" required />
                                        </div>

                                        {/* 🌟 REFACTORED: Whitelisted SaaS Embedding Domain Tracker Block with Tier Access Interceptors */}
                                        <div className="space-y-1 text-left">
                                            <div className="flex justify-between items-center px-1 mb-1">
                                                <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] flex items-center gap-1.5">
                                                    <Globe size={11} className="text-[#4cd7f6]" /> Authorized Embed Web Domains
                                                </label>
                                                {allowedOriginNumber !== null && (
                                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${currentOriginsCount > allowedOriginNumber ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-[#1c1f2a] text-zinc-400 border border-[#2d3142]'}`}>
                                                        Allotment: {currentOriginsCount}/{allowedOriginNumber} slots
                                                    </span>
                                                )}
                                            </div>

                                            {allowedOriginNumber === 0 ? (
                                                /* Locked view wrapper logic metrics block if tracking allocations remain hard capped to zero */
                                                <div className="bg-[#0a0e18]/80 border border-[#1f2937] p-3.5 rounded-xl flex items-center gap-3 text-left">
                                                    <Lock size={14} className="text-amber-400 flex-shrink-0" />
                                                    <div className="flex-grow">
                                                        <p className="text-xs text-white font-medium">Domain Restrictions Active</p>
                                                        <p className="text-[10px] text-[#ccc3d8]/70 mt-0.5">Your standard Free Tier parameters restrict cross-origin production embeddings. Local host tracking active.</p>
                                                    </div>
                                                    <Link to="/subscription" className="text-[10px] font-bold font-mono uppercase text-[#4cd7f6] hover:underline whitespace-nowrap">Upgrade ➔</Link>
                                                </div>
                                            ) : (
                                                <>
                                                    <input 
                                                        type="text" 
                                                        name="allowedDomains" 
                                                        value={config.allowedDomains} 
                                                        onChange={handleInputChange} 
                                                        disabled={allowedOriginNumber === 0}
                                                        placeholder="mysite.com, staging.platform.in" 
                                                        className={`input-dark w-full px-4 py-3 text-xs font-mono transition-colors ${allowedOriginNumber !== null && currentOriginsCount > allowedOriginNumber ? 'border-red-500/40 focus:border-red-500 focus:ring-1 focus:ring-red-500' : ''}`} 
                                                    />
                                                    <div className="text-[10px] font-sans text-zinc-500 leading-normal pl-1 pt-0.5">
                                                        Separate multiple URLs using commas. Your current active tier maps up to <strong className="text-zinc-400 font-mono">{allowedOriginNumber}</strong> distinct hostnames safely.
                                                    </div>
                                                    {allowedOriginNumber !== null && currentOriginsCount > allowedOriginNumber && (
                                                        <p className="text-[10px] font-mono text-red-400 flex items-center gap-1 mt-1 pl-1">
                                                            <AlertTriangle size={10} /> Boundaries broken down. Prune array options before moving upstream.
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">Agent Behavioral Persona</label>
                                            <div className="relative">
                                                <select name="backboneModel" value={config.backboneModel} onChange={handleInputChange} className="w-full bg-[#0a0e18]/50 border border-[#1f2937] text-white rounded-xl px-4 py-3 text-xs appearance-none focus:outline-none">
                                                    <option value="professional">Professional (Analytical, Corporate, Direct)</option>
                                                    <option value="friendly">Friendly (Approachable, Empathetic, Engaging)</option>
                                                    <option value="creative">Creative (Brainstorming, Bold, Conversational)</option>
                                                    <option value="technical">Technical Support (Code-Fluent, Diagnostic, Precise)</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#ccc3d8]"><Settings2 size={14} className="rotate-90" /></div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] px-1"><span>Creativity Temperature</span><span className="text-[#4cd7f6] text-xs font-mono">{config.creativityTemperature}</span></div>
                                            <input type="range" name="creativityTemperature" min="0" max="1" step="0.1" value={config.creativityTemperature} onChange={handleInputChange} className="w-full accent-[#7c3aed] bg-[#1c1f2a] h-1.5 rounded-lg appearance-none cursor-pointer" />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">Knowledge Feed Interface Source</label>
                                            <div className="grid grid-cols-2 gap-3 p-1 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl">
                                                <button type="button" onClick={() => setDirectiveSource('textarea')} className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${directiveSource === 'textarea' ? 'bg-[#7c3aed] text-white' : 'text-[#ccc3d8] hover:text-white'}`}><Code2 size={13} /> Custom Directives Text</button>
                                                <button type="button" onClick={() => setDirectiveSource('file')} className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${directiveSource === 'file' ? 'bg-[#7c3aed] text-white' : 'text-[#ccc3d8] hover:text-white'}`}><FileText size={13} /> Upload Context Document</button>
                                            </div>
                                        </div>

                                        {directiveSource === 'textarea' ? (
                                            <div className="space-y-1 text-left">
                                                <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">System Instructions</label>
                                                <textarea name="systemDirective" rows={3} value={config.systemDirective} onChange={handleInputChange} className="input-dark w-full px-4 py-3 text-xs font-mono resize-none leading-relaxed" placeholder="Instruct your virtual workforce asset..." required />
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-[#4a4455] rounded-xl p-6 text-center relative bg-[#0a0e18]/20 group hover:border-[#4cd7f6]/40 transition-colors">
                                                <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.md" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                                {!uploadedFile ? (
                                                    <div className="space-y-2">
                                                        <UploadCloud size={28} className="mx-auto text-[#ccc3d8] group-hover:text-[#4cd7f6] transition-colors" />
                                                        <p className="text-xs text-[#dfe2f1]">Drop or map your payload profile array here</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-[#111827] p-3 rounded-lg border border-[#1f2937]">
                                                        <div className="flex items-center gap-2 text-left"><FileText size={16} className="text-[#4cd7f6]" /><div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white font-mono">{uploadedFile.name}</div></div>
                                                        <button type="button" onClick={removeFile} className="text-[#ffafd3] hover:text-white transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 🌟 REFACTORED: Persistent Context Switch Gated with hasVectorAccess Layer Rules */}
                                        <div className="flex items-center justify-between p-4 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl mt-2 relative overflow-hidden">
                                            {!hasVectorAccess && (
                                                <div className="absolute inset-0 z-30 bg-[#0c0f17]/80 backdrop-blur-[1px] flex items-center justify-center px-4 gap-2 transition-all group">
                                                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Lock size={10} /> Requires Growth Tier
                                                    </span>
                                                    <Link to="/subscription" className="text-[10px] font-bold font-mono text-[#4cd7f6] hover:underline uppercase transition-all">Upgrade ➔</Link>
                                                </div>
                                            )}
                                            <div className="flex flex-col text-left font-body">
                                                <span className="text-xs font-bold text-white flex items-center gap-1.5"><Database size={13} className="text-[#4cd7f6]" /> Persistent Vector Context Memory</span>
                                                <span className="text-[11px] text-[#ccc3d8] opacity-80 mt-0.5">Permits cross-session conversation caching.</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                disabled={!hasVectorAccess}
                                                onClick={() => setConfig(prev => ({ ...prev, vectorMemory: !prev.vectorMemory }))} 
                                                className={`w-10 h-5 rounded-full p-0.5 flex relative items-center transition-colors cursor-pointer ${config.vectorMemory && hasVectorAccess ? 'bg-[#7c3aed]' : 'bg-[#262a35]'}`}
                                            >
                                                <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" animate={{ x: config.vectorMemory && hasVectorAccess ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        type="button" 
                                        disabled={allowedOriginNumber !== null && currentOriginsCount > allowedOriginNumber}
                                        onClick={() => setCurrentPhase(2)} 
                                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-sm font-heading cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Advance to Visual Styling <ChevronRight size={16} />
                                    </button>
                                </motion.div>
                            )}

                            {/* PHASE 2: BRANDING CONTROLLER */}
                            {currentPhase === 2 && (
                                <motion.div key="phase2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-sm font-bold text-white font-heading tracking-tight flex items-center gap-2"><Paintbrush size={14} className="text-[#4cd7f6]" /> Step 2: Branding Token Suite</h3>
                                        <p className="text-[11px] text-[#ccc3d8]">Configure launcher typography frames, primary color accents, and radii.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0e18] border border-[#1f2937] rounded-xl text-xs font-mono font-semibold">
                                        <button type="button" onClick={() => setCanvasViewMode('minimized')} className={`py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${canvasViewMode === 'minimized' ? 'bg-[#4cd7f6] text-[#003640]' : 'text-[#ccc3d8]'}`}><ToggleLeft size={14} /> 1. Closed Launcher State</button>
                                        <button type="button" onClick={() => setCanvasViewMode('expanded')} className={`py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${canvasViewMode === 'expanded' ? 'bg-[#4cd7f6] text-[#003640]' : 'text-[#ccc3d8]'}`}><MessageSquare size={14} /> 2. Open Chat View Window</button>
                                    </div>

                                    <div className="space-y-4">
                                        {canvasViewMode === 'minimized' ? (
                                            <div className="space-y-4 text-left p-4 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl animate-fade-in">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Launcher Content Format</label>
                                                    <select name="launcherType" value={config.launcherType} onChange={handleInputChange} className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-xl px-4 py-2.5 text-xs appearance-none">
                                                        <option value="combined">Combined (Logo Image + Text Pilling)</option>
                                                        <option value="icon">Icon / Logo Bubble Only</option>
                                                    </select>
                                                </div>

                                                <AnimatePresence>
                                                    {config.launcherType !== 'icon' && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                                                            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Custom Pill Text</label>
                                                            <input type="text" name="launcherText" value={config.launcherText} onChange={handleInputChange} placeholder={`Chat with ${config.agentName}`} maxLength={30} className="input-dark w-full px-4 py-2.5 text-xs font-sans" />
                                                            <div className="flex justify-between text-[9px] font-mono text-zinc-500 px-1"><span>Displays when launcher layout is open/collapsed</span><span>{config.launcherText.length}/30 characters</span></div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Launcher Graphic Source</label>
                                                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#111827] rounded-lg border border-[#1f2937]">
                                                        <button type="button" onClick={() => setConfig(p => ({ ...p, logoSource: 'glyph' }))} className={`py-1.5 text-xs rounded font-medium transition-all cursor-pointer ${config.logoSource === 'glyph' ? 'bg-[#7c3aed] text-white' : 'text-[#ccc3d8]'}`}>Preset Glyphs</button>
                                                        <button type="button" onClick={() => setConfig(p => ({ ...p, logoSource: 'custom' }))} className={`py-1.5 text-xs rounded font-medium transition-all cursor-pointer ${config.logoSource === 'custom' ? 'bg-[#7c3aed] text-white' : 'text-[#ccc3d8]'}`}>Custom Image</button>
                                                    </div>
                                                </div>

                                                {config.logoSource === 'glyph' ? (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Select Core System Glyph</label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[
                                                                { id: 'sparkle', label: 'Sparkle', icon: Sparkles },
                                                                { id: 'bot', label: 'Agent Bot', icon: Bot },
                                                                { id: 'terminal', label: 'Terminal', icon: Terminal }
                                                            ].map((g) => {
                                                                const IconComp = g.icon;
                                                                return (
                                                                    <button key={g.id} type="button" onClick={() => setConfig(p => ({ ...p, selectedGlyph: g.id as any }))} className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-mono cursor-pointer ${config.selectedGlyph === g.id ? 'border-[#4cd7f6] bg-[#03b5d3]/5 text-[#4cd7f6]' : 'border-[#1f2937] text-[#ccc3d8] hover:text-white'}`}><IconComp size={16} /><span className="text-[10px]">{g.label}</span></button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Upload Square Launcher Logo Image</label>
                                                        {!config.customLogoUrl ? (
                                                            <div className="border border-dashed border-[#4a4455] rounded-xl p-4 text-center relative bg-[#111827]/50 group hover:border-[#4cd7f6]/40 transition-colors">
                                                                <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                                                <div className="flex items-center justify-center gap-2 text-[#ccc3d8] group-hover:text-white transition-colors py-2"><Image size={16} /><span className="text-xs font-mono">Select Logo Image (SVG, PNG)</span></div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between bg-[#111827] p-2.5 rounded-xl border border-[#1f2937]">
                                                                <div className="flex items-center gap-3"><img src={config.customLogoUrl} alt="Custom Launcher" className="w-10 h-10 object-cover rounded-lg border border-white/10" /><span className="text-xs text-[#ccc3d8] font-mono">Custom Branding Token Loaded</span></div>
                                                                <button type="button" onClick={clearCustomLogo} className="p-1.5 bg-red-500/10 text-red-400 hover:text-white border border-red-500/10 rounded-lg"><X size={14} /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4 text-left p-4 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl animate-fade-in">
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1"><label className="text-[9px] font-bold font-mono text-[#ccc3d8] block">Primary Base</label><input type="color" name="primaryColor" value={config.primaryColor} onChange={handleInputChange} className="w-full h-8 bg-transparent border-0 rounded cursor-pointer" /></div>
                                                    <div className="space-y-1"><label className="text-[9px] font-bold font-mono text-[#ccc3d8] block">Secondary Core</label><input type="color" name="secondaryColor" value={config.secondaryColor} onChange={handleInputChange} className="w-full h-8 bg-transparent border-0 rounded cursor-pointer" /></div>
                                                    <div className="space-y-1"><label className="text-[9px] font-bold font-mono text-[#ccc3d8] block">Canvas Panel</label><input type="color" name="surfaceColor" value={config.surfaceColor} onChange={handleInputChange} className="w-full h-8 bg-transparent border-0 rounded cursor-pointer" /></div>
                                                </div>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex justify-between text-[10px] font-mono font-bold text-[#ccc3d8]"><span>Container Corner Radius</span><span>{config.borderRadius}px</span></div>
                                                    <input type="range" name="borderRadius" min="4" max="24" step="2" value={config.borderRadius} onChange={handleInputChange} className="w-full accent-[#4cd7f6] bg-[#1c1f2a] h-1.5 rounded-lg appearance-none cursor-pointer" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setCurrentPhase(1)} className="flex-1 bg-[#171b26] border border-[#4a4455] py-4 rounded-xl text-white text-xs font-bold font-heading flex items-center justify-center gap-1 cursor-pointer"><ArrowLeft size={14} /> Back</button>
                                        <button type="button" onClick={() => setCurrentPhase(3)} className="flex-[2] btn-primary py-4 text-xs font-bold font-heading flex items-center justify-center gap-2 cursor-pointer">Advance to Mechanics <ChevronRight size={14} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* PHASE 3: INTERACTION KINETICS MULTI-SECTION WIZARD */}
                            {currentPhase === 3 && (
                                <motion.div key="phase3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-sm font-bold text-white font-heading tracking-tight flex items-center gap-2">
                                            <Eye size={14} className="text-amber-400" /> Step 3: Interaction Kinetics
                                        </h3>
                                        <p className="text-[11px] text-[#ccc3d8]">Fine-tune client-side velocities, hover feedback modes, and viewport entry states.</p>
                                    </div>

                                    <div className="space-y-6 text-left p-5 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl font-body overflow-y-auto max-h-[520px] custom-scrollbar">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-mono font-bold text-[#ccc3d8]">
                                                <span>Hover Response Duration</span>
                                                <span className="text-[#4cd7f6] font-mono">{config.hoverSpeed}s</span>
                                            </div>
                                            <input type="range" name="hoverSpeed" min="0.1" max="0.8" step="0.05" value={config.hoverSpeed} onChange={handleInputChange} className="w-full accent-[#4cd7f6] bg-[#1c1f2a] h-1.5 rounded-lg appearance-none cursor-pointer" />
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center gap-2 pb-1 border-b border-white/[0.04]">
                                                <MessageSquare size={13} className="text-[#7c3aed]" />
                                                <h4 className="text-[11px] font-bold font-mono text-[#7c3aed] uppercase tracking-wider">2. Chat Console Mechanics</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Open Animation</label>
                                                    <select name="chatOpenAnimation" value={config.chatOpenAnimation} onChange={handleInputChange} className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-xl px-4 py-2.5 text-xs appearance-none focus:outline-none">
                                                        <option value="pop-in">Pop In (Scale Up)</option>
                                                        <option value="slide-up">Slide Up (Eased Vertical)</option>
                                                        <option value="fade-in">Fade In (Alpha Trace)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Close Animation</label>
                                                    <select name="chatCloseAnimation" value={config.chatCloseAnimation} onChange={handleInputChange} className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-xl px-4 py-2.5 text-xs appearance-none focus:outline-none">
                                                        <option value="scale-out">Scale Out (Shrink)</option>
                                                        <option value="slide-down">Slide Down (Drop out)</option>
                                                        <option value="fade-out">Fade Out (Alpha Dissolve)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] font-mono font-bold text-[#ccc3d8]">
                                                    <span>Console Expansion Duration</span>
                                                    <span className="text-[#7c3aed] font-mono">{config.chatTransitionSpeed}s</span>
                                                </div>
                                                <input type="range" name="chatTransitionSpeed" min="0.1" max="1.2" step="0.05" value={config.chatTransitionSpeed} onChange={handleInputChange} className="w-full accent-[#7c3aed] bg-[#1c1f2a] h-1.5 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center gap-2 pb-1 border-b border-white/[0.04]">
                                                <Sparkles size={13} className="text-amber-400" />
                                                <h4 className="text-[11px] font-bold font-mono text-amber-400 uppercase tracking-wider">3. Initial Core Ingress Load</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Entrance Profile Type</label>
                                                    <select name="entranceAnimation" value={config.entranceAnimation} onChange={handleInputChange} className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-xl px-4 py-2.5 text-xs appearance-none focus:outline-none">
                                                        <option value="slide-up">Slide Up Transition</option>
                                                        <option value="pop-in">Pop In Spring Scale</option>
                                                        <option value="fade-in">Fade In Alpha Trace</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8]">Velocity Curve Speed</label>
                                                    <select name="entranceSpeed" value={config.entranceSpeed} onChange={handleInputChange} className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-xl px-4 py-2.5 text-xs appearance-none focus:outline-none">
                                                        <option value="normal">Normal (Standard Ease)</option>
                                                        <option value="slow">Slow (Immersive Reveal)</option>
                                                        <option value="fast">Fast (Instant Injection)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] font-mono font-bold text-[#ccc3d8]">
                                                    <span>Initial Initialization Delay</span>
                                                    <span className="text-amber-400 font-mono">{config.entranceDelayDuration}s</span>
                                                </div>
                                                <input type="range" name="entranceDelayDuration" min="0" max="3" step="0.1" value={config.entranceDelayDuration} onChange={handleInputChange} className="w-full accent-amber-400 bg-[#1c1f2a] h-1.5 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setCurrentPhase(2)} className="flex-1 bg-[#171b26] border border-[#1f2937] py-4 rounded-xl text-white text-xs font-bold font-heading flex items-center justify-center gap-1 cursor-pointer">
                                            <ArrowLeft size={14} /> Back
                                        </button>
                                        <button type="submit" disabled={actionLoading} className="flex-[2] btn-primary text-white py-4 text-xs font-bold font-heading flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/10 transition-all hover:scale-[1.01]">
                                            {actionLoading ? (
                                                <div className="border-2 border-black/30 border-t-black rounded-full animate-spin h-3.5 w-3.5" />
                                            ) : (
                                                <><Sparkles size={14} /> Complete Cluster Forge</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                )}
            </motion.div>

            {/* ================= RIGHT COLUMN: LIVE CANVAS PREVIEW ================= */}
            <div className="lg:col-span-5 w-full">
                <motion.div
                    variants={fadeInUp}
                    className="sticky top-24 flex flex-col items-center justify-center min-h-[440px] w-full bg-[#111827]/10 border border-zinc-800/30 rounded-xl backdrop-blur-xs overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {currentPhase !== 3 ? (
                            <motion.div
                                key="canvas-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full flex items-center justify-center p-4"
                            >
                                <LiveChatPreview
                                    agentName={config.agentName}
                                    backboneModel={config.backboneModel}
                                    primaryColor={config.primaryColor}
                                    secondaryColor={config.secondaryColor}
                                    surfaceColor={config.surfaceColor}
                                    borderRadius={config.borderRadius}
                                    isThinking={actionLoading}
                                    renderMode={canvasViewMode}
                                    launcherType={config.launcherType}
                                    launcherText={config.launcherText}
                                    logoSource={config.logoSource}
                                    selectedGlyph={config.selectedGlyph}
                                    customLogoUrl={config.customLogoUrl}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="interaction-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full p-4"
                            >
                                <LiveInteractionPreview
                                    agentName={config.agentName}
                                    primaryColor={config.primaryColor}
                                    secondaryColor={config.secondaryColor}
                                    surfaceColor={config.surfaceColor}
                                    borderRadius={config.borderRadius}
                                    launcherType={config.launcherType}
                                    launcherText={config.launcherText}
                                    logoSource={config.logoSource}
                                    selectedGlyph={config.selectedGlyph}
                                    customLogoUrl={config.customLogoUrl}
                                    hoverAnimation={config.hoverAnimation}
                                    hoverSpeed={config.hoverSpeed}
                                    chatOpenAnimation={config.chatOpenAnimation}
                                    chatCloseAnimation={config.chatCloseAnimation}
                                    chatTransitionSpeed={config.chatTransitionSpeed}
                                    entranceAnimation={config.entranceAnimation}
                                    entranceSpeed={config.entranceSpeed}
                                    entranceDelayDuration={config.entranceDelayDuration}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}