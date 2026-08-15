import { useState, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Terminal, Shield } from 'lucide-react';
import { motion, AnimatePresence, type Variant, type MotionProps } from 'framer-motion';

export interface LiveInteractionPreviewProps {
    agentName: string;
    primaryColor: string;
    secondaryColor: string;
    surfaceColor: string;
    borderRadius: number;
    launcherType: 'icon' | 'text' | 'combined';
    launcherText: string;
    logoSource: 'glyph' | 'custom';
    selectedGlyph: 'sparkle' | 'bot' | 'terminal';
    customLogoUrl: string | null;

    // 🌟 Expanded Phase 3 Kinetic Triggers
    hoverAnimation: 'none' | 'expand-text' | 'pulse-glow' | 'bounce';
    hoverSpeed: number;
    chatOpenAnimation: 'pop-in' | 'slide-up' | 'fade-in';
    chatCloseAnimation: 'scale-out' | 'slide-down' | 'fade-out';
    chatTransitionSpeed: number;
    entranceAnimation: 'fade-in' | 'slide-up' | 'pop-in';
    entranceSpeed: 'slow' | 'normal' | 'fast';
    entranceDelayDuration: number;
}

export default function LiveInteractionPreview({
    agentName, primaryColor, surfaceColor, borderRadius,
    launcherType, launcherText, logoSource, selectedGlyph, customLogoUrl,
    hoverAnimation, hoverSpeed, chatOpenAnimation, chatCloseAnimation,
    chatTransitionSpeed, entranceAnimation, entranceSpeed, entranceDelayDuration
}: LiveInteractionPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);

    // Re-trigger entrance sequence when parameters shift
    useEffect(() => {
        setHasEntered(false);
        const delayTimer = setTimeout(() => {
            setHasEntered(true);
        }, entranceDelayDuration * 1000 || 50);
        return () => clearTimeout(delayTimer);
    }, [entranceAnimation, entranceDelayDuration]);

    const renderGlyph = (size: number) => {
        if (logoSource === 'custom' && customLogoUrl) {
            return <img src={customLogoUrl} alt="logo" className="w-full h-full object-cover rounded-md" />;
        }
        switch (selectedGlyph) {
            case 'bot': return <Bot size={size} />;
            case 'terminal': return <Terminal size={size} />;
            default: return <Sparkles size={size} />;
        }
    };

    // --- 3. Initial Core Ingress Load Core Duration Engine ---
    const getEntranceDuration = () => {
        switch (entranceSpeed) {
            case 'slow': return 0.9;
            case 'fast': return 0.2;
            default: return 0.45;
        }
    };

    // ✅ FIXED: Enforced explicit typecasting to clear compiler property warnings on the button
    const getEntranceVariants = () => {
        switch (entranceAnimation) {
            case 'slide-up':
                return {
                    hidden: { opacity: 0, y: 50 } as Variant,
                    visible: { opacity: 1, y: 0, transition: { duration: getEntranceDuration(), ease: "easeOut" } } as Variant
                };
            case 'pop-in':
                return {
                    hidden: { opacity: 0, scale: 0.5 } as Variant,
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } } as Variant
                };
            default:
                return {
                    hidden: { opacity: 0 } as Variant,
                    visible: { opacity: 1, transition: { duration: getEntranceDuration() } } as Variant
                };
        }
    };

    // --- 2. Chat Console Entry/Exit Animation Matrix Maps ---
    // ✅ FIXED: Cast each variant profile state explicitly to resolve 'scale' object tracking errors
    const getChatWindowMotionProps = (): MotionProps => {
        let initialProps: Variant = { opacity: 0 };
        let animateProps: Variant = { opacity: 1 };
        let exitProps: Variant = { opacity: 0 };

        // Opening Animations
        if (chatOpenAnimation === 'pop-in') {
            initialProps = { ...initialProps, scale: 0.88, y: 10 };
            animateProps = { ...animateProps, scale: 1, y: 0 };
        }
        if (chatOpenAnimation === 'slide-up') {
            initialProps = { ...initialProps, scale: 1, y: 40 };
            animateProps = { ...animateProps, scale: 1, y: 0 };
        }

        // Closing Animations
        if (chatCloseAnimation === 'scale-out') {
            exitProps = { ...exitProps, scale: 0.85, y: 8 };
        }
        if (chatCloseAnimation === 'slide-down') {
            exitProps = { ...exitProps, scale: 1, y: 50 };
        }

        return {
            initial: initialProps,
            animate: animateProps,
            exit: exitProps,
            transition: { duration: chatTransitionSpeed, ease: [0.16, 1, 0.3, 1] }
        };
    };

    const isExpandTextMode = hoverAnimation === 'expand-text' && launcherType !== 'icon';
    const isPillVisible = launcherType === 'combined' && (!isExpandTextMode || isHovered);

    return (
        <div className="w-full h-[440px] bg-[#090d16] border border-zinc-800/40 rounded-xl overflow-hidden flex flex-col justify-between p-4 group/window shadow-inner selection:bg-transparent sticky top-45">

            {/* Fake Browser Top URL Frame Bar */}
            <div className="w-full bg-zinc-950/60 border border-white/[0.04] rounded-lg px-3 py-2 flex items-center gap-2 text-[10px] font-mono text-zinc-500 select-none shrink-0 z-20">
                <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-zinc-800" /><span className="w-2 h-2 rounded-full bg-zinc-800" /></div>
                <div className="bg-[#111622] rounded flex-1 py-0.5 px-2 border border-white/[0.02] text-zinc-400 flex items-center gap-1.5 truncate">
                    <Shield size={10} className="text-emerald-500" /> https://your-customer-website.com
                </div>
            </div>

            {/* Main Preview Sandbox Workspace Environment */}
            <div className="flex-1 w-full relative flex items-center justify-center z-10">
                <p className="text-[11px] font-mono text-zinc-600 tracking-widest text-center uppercase select-none max-w-xs leading-relaxed opacity-60">
                    {isExpanded ? "Interactive App Sandbox Active" : "Hover or Click the Live Target Widget Asset Below"}
                </p>

                {/* CLAMPED POSITION FLOATING CONTAINER ELEMENT */}
                <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end justify-end">
                    <AnimatePresence mode="wait">
                        {!isExpanded ? (
                            /* ================= 🚀 1. LIVING LAUNCHER KINETICS BUBBLE ================= */
                            <motion.button
                                key="launcher"
                                variants={getEntranceVariants()}
                                initial="hidden"
                                animate={hasEntered ? "visible" : "hidden"}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => setIsExpanded(true)}
                                whileHover={
                                    hoverAnimation === 'bounce'
                                        ? { y: -6, transition: { type: "spring", stiffness: 300, damping: 12 } }
                                        : hoverAnimation === 'pulse-glow'
                                            ? { boxShadow: `0 0 24px ${primaryColor}cc`, scale: 1.02 }
                                            : hoverAnimation === 'expand-text'
                                                ? { scale: 1.02 }
                                                : {}
                                }
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                    width: isExpandTextMode ? (isHovered ? '190px' : '48px') : 'auto',
                                    transition: `width ${hoverSpeed}s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s`
                                }}
                                className="h-12 flex items-center justify-center text-white border border-white/15 px-4 gap-2.5 cursor-pointer text-xs font-mono font-bold tracking-wide rounded-full overflow-hidden whitespace-nowrap outline-none"
                            >
                                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                    {renderGlyph(16)}
                                </div>

                                {isPillVisible && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: hoverSpeed }}
                                        className="pr-1 text-[11px] font-sans font-semibold text-white tracking-wide w-full mr-2"
                                    >
                                        {launcherText || `Chat with ${agentName.split('-')[0]}`}
                                    </motion.span>
                                )}
                            </motion.button>
                        ) : (
                            /* ================= 📥 2. CHAT CONSOLE WORKSPACE MECHANICS ================= */
                            <motion.div
                                key="chat-window"
                                {...getChatWindowMotionProps()} // ✅ FIXED: Spreads completely clean typechecked values now with zero warnings
                                style={{ borderRadius: `${borderRadius}px`, backgroundColor: surfaceColor }}
                                className="w-[290px] h-[340px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] border border-zinc-800/80 flex flex-col justify-between overflow-hidden text-left origin-bottom-right"
                            >
                                {/* Header Section */}
                                <div style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)`, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="p-3 flex justify-between items-center shrink-0 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <div style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }} className="h-6 w-6 rounded-lg border flex items-center justify-center text-white overflow-hidden">
                                            {renderGlyph(12)}
                                        </div>
                                        <h4 className="text-[11px] font-bold text-zinc-200 tracking-wide font-sans max-w-[170px] truncate">{agentName}</h4>
                                    </div>
                                    <button onClick={() => { setIsExpanded(false); setIsHovered(false); }} className="p-1 text-zinc-500 hover:text-white rounded-md hover:bg-white/5 cursor-pointer transition-colors">
                                        <X size={13} />
                                    </button>
                                </div>

                                {/* Simulated Logs Body */}
                                <div className="flex-1 p-3 flex flex-col justify-center text-center space-y-1 bg-black/10 select-none">
                                    <span className="text-[16px]">🚀</span>
                                    <h6 className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider uppercase">Sandbox Active</h6>
                                    <p className="text-[9px] text-zinc-600 max-w-[200px] mx-auto font-sans leading-normal"> Handshake running on native frame layer coordinates. </p>
                                </div>

                                {/* Mock Input Form Footer */}
                                <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/20 flex gap-1.5 items-center">
                                    <div className="flex-1 bg-white/[0.02] border border-zinc-800/80 text-[10px] text-zinc-500 rounded-lg px-2.5 py-1.5 font-sans">
                                        Type parameter parameters...
                                    </div>
                                    <div style={{ backgroundColor: primaryColor }} className="h-7 w-7 rounded-lg flex items-center justify-center text-white opacity-40 shrink-0">
                                        <Send size={10} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Information Indicator Status Line Footer Analytics Layout */}
            <div className="w-full flex justify-between items-center text-[9px] font-mono text-zinc-600 tracking-wide border-t border-zinc-900 pt-2 shrink-0 select-none z-20">
                <span>Hover Speed: <span className="text-[#4cd7f6] font-bold">{hoverSpeed}s</span></span>
                <span>Transition Speed: <span className="text-[#7c3aed] font-bold">{chatTransitionSpeed}s</span></span>
                <span>Ingress Delay: <span className="text-amber-400 font-bold">{entranceDelayDuration}s</span></span>
            </div>
        </div>
    );
}