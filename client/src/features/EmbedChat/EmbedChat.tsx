import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { X, Send, Bot, Sparkles, Terminal } from 'lucide-react';
import { AnimatePresence, motion, type Variant, type MotionProps } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

export default function EmbedChat() {
  const { agentId } = useParams<{ agentId: string }>();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; timestamp: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Read clients positioning properties handed over by the parent iframe window track
  const alignX = searchParams.get('alignX') || 'right';
  const alignY = searchParams.get('alignY') || 'bottom';

  useEffect(() => {
    const loadEmbeddedConfig = async () => {
      if (!agentId) return;
      try {
        const response = await fetch(`${BASE_URL}/agents/public/details/${agentId}`); //
        const data = await response.json(); //
        if (data && data.success) {
          setAgent(data.agent); //
          
          // ✅ CRITICAL EMIT HANDSHAKE: Notify the parent script of branding parameters to fire initialization animations
          window.parent.postMessage({
            type: 'AGENTFORGE_WIDGET_MOUNTED',
            uiBranding: data.agent.uiBranding
          }, '*');
        }
      } catch (err) {
        console.error("[AgentForge Embed Failure] Handshake error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEmbeddedConfig();
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); //
  }, [messages, isTyping]); //

  // Resolve custom collapsed width boundaries natively to calculate expansion footprints
  const getCollapsedWidth = (brandObj: any) => {
    if (!brandObj) return '76px';
    return brandObj.launcherType === 'icon' || brandObj.hoverAnimation === 'expand-text' ? '100%' : '210px';
  };

  const toggleWidgetResize = (expandedState: boolean) => {
    setIsExpanded(expandedState);
    window.parent.postMessage({
      type: 'AGENTFORGE_WIDGET_RESIZE',
      state: expandedState ? 'expanded' : 'minimized',
      collapsedWidth: getCollapsedWidth(agent?.uiBranding) //
    }, '*');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault(); //
    if (!inputValue.trim()) return; //

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); //
    setMessages(prev => [...prev, { text: inputValue.trim(), sender: 'user', timestamp: timeString }]); //
    setInputValue(''); //
    
    setIsTyping(true); //
    setTimeout(() => {
      setIsTyping(false); //
      setMessages(prev => [...prev, { 
        text: "Neural workspace handshake verified. This server-directed container blocks are operational.", 
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  if (loading || !agent) return null;

  const branding = agent.uiBranding;
  const primary = branding?.primaryColor || '#7c3aed'; //
  const secondary = branding?.secondaryColor || '#4cd7f6'; //
  const radius = `${branding?.borderRadius || 16}px`; //
  const customBg = branding?.surfaceColor || '#0f131d'; //
  const textLabel = branding?.launcherText || 'Chat'; //

  const isExpandTextMode = branding?.hoverAnimation === 'expand-text' && branding?.launcherType !== 'icon';
  const isPillVisible = branding?.launcherType === 'combined' && (!isExpandTextMode || isHovered);

  const renderIdentityLogo = (iconSize: number = 16) => {
    if (branding?.logoSource === 'custom' && branding?.customLogoUrl) {
      return (
        <img 
          src={branding.customLogoUrl} 
          alt="Identity Brand" 
          style={{ borderRadius: `${parseInt(radius) / 2}px` }} //
          className="object-cover shadow-sm h-full w-full" 
        />
      );
    }
    switch (branding?.selectedGlyph) { //
      case 'sparkle': return <Sparkles size={iconSize} style={{ color: secondary }} />; //
      case 'terminal': return <Terminal size={iconSize} style={{ color: secondary }} />; //
      default: return <Bot size={iconSize} style={{ color: secondary }} />; //
    }
  };

  // --- 🌟 SECTION 2: CHAT CONSOLE MOTION PROPS DRIVEN BY BACKEND METRICS ---
  const getChatWindowMotionProps = (): MotionProps => {
    let initialProps: Variant = { opacity: 0 };
    let animateProps: Variant = { opacity: 1 };
    let exitProps: Variant = { opacity: 0 };

    const originYSign = alignY === 'bottom' ? 20 : -20;
    // const originXSign = alignX === 'right' ? 15 : -15;

    if (branding?.chatOpenAnimation === 'pop-in') { 
      initialProps = { ...initialProps, scale: 0.88, y: originYSign }; 
      animateProps = { ...animateProps, scale: 1, y: 0 }; 
    }
    if (branding?.chatOpenAnimation === 'slide-up') { 
      initialProps = { ...initialProps, scale: 1, y: originYSign * 2 }; 
      animateProps = { ...animateProps, scale: 1, y: 0 }; 
    }

    if (branding?.chatCloseAnimation === 'scale-out') { exitProps = { ...exitProps, scale: 0.85, y: originYSign / 2 }; }
    if (branding?.chatCloseAnimation === 'slide-down') { exitProps = { ...exitProps, scale: 1, y: originYSign * 2.5 }; }

    return {
      initial: initialProps,
      animate: animateProps,
      exit: exitProps,
      transition: { duration: branding?.chatTransitionSpeed || 0.4, ease: [0.16, 1, 0.3, 1] }
    };
  };

  // Manage origin alignment styling configurations smoothly based on parent layout options
  const layoutAlignmentClass = `items-${alignY === 'bottom' ? 'end' : 'start'} justify-${alignX === 'right' ? 'end' : 'start'}`;
  const originTransformAnchor = `origin-${alignY}-${alignX}`;

  return (
    <div className={`w-full h-full select-none overflow-hidden flex bg-transparent border-0 outline-none antialiased p-1 absolute ${layoutAlignmentClass}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ================= 🚀 SECTION 1: LAUNCHER BUBBLE MODE KINETICS ================= */
          <motion.button
            key="launcher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => toggleWidgetResize(true)}
            whileHover={
              branding?.hoverAnimation === 'bounce'
                ? { y: alignY === 'bottom' ? -6 : 6, transition: { type: "spring", stiffness: 300, damping: 12 } }
                : branding?.hoverAnimation === 'pulse-glow'
                ? { boxShadow: `0 0 24px ${primary}cc`, scale: 1.02 }
                : branding?.hoverAnimation === 'expand-text'
                ? { scale: 1.02 }
                : {}
            }
            style={{ 
              backgroundColor: primary,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              // The text width expansion is animated natively based on saved database configurations
              width: isExpandTextMode ? (isHovered ? '200px' : '48px') : 'auto',
              transition: `width ${branding?.hoverSpeed || 0.3}s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s`,
              borderRadius: branding?.launcherType === 'icon' ? '50%' : '9999px'
            }}
            className="h-12 flex items-center justify-center text-white cursor-pointer border border-white/10 px-4 gap-2.5 text-xs font-mono font-bold tracking-wide overflow-hidden whitespace-nowrap outline-none shadow-xl absolute"
          >
            <div className="w-5 h-5 flex items-center justify-center text-white shrink-0">
              {renderIdentityLogo(16)}
            </div>
            {isPillVisible && (
              <motion.span 
                initial={{ opacity: 0, x: alignX === 'right' ? -6 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: branding?.hoverSpeed || 0.3 }}
                className="pr-1 text-[11px] font-sans font-semibold text-white tracking-wide w-fit-content"
              >
                {textLabel}
              </motion.span>
            )}
          </motion.button>
        ) : (
          /* ================= 📥 SECTION 2: INTERACTIVE PANEL WINDOW ================= */
          <motion.div
            key="chat-window"
            {...getChatWindowMotionProps()}
            style={{ borderRadius: radius, backgroundColor: customBg }}
            className={`w-[350px] h-[520px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] border border-zinc-800/80 flex flex-col justify-between overflow-hidden relative ${originTransformAnchor}`}
          >
            {/* Top Header Bar Layout */}
            <div style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)`, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="p-3.5 flex justify-between items-center shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: `${primary}15`, borderColor: `${primary}30` }} className="h-8 w-8 rounded-xl border flex items-center justify-center shadow-inner overflow-hidden">
                  {renderIdentityLogo(15)}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-100 tracking-wide font-sans">{agent.agentName}</h4>
                  <p className="text-[9px] text-[#4cd7f6] font-mono tracking-widest uppercase flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-[#4cd7f6] animate-pulse" /> operational
                  </p>
                </div>
              </div>
              <button onClick={() => toggleWidgetResize(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer hover:bg-white/5">
                <X size={15} />
              </button>
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar bg-gradient-to-b from-transparent to-black/10">
              {messages.length === 0 && (
                <div className="my-auto max-w-[85%] mx-auto text-center space-y-2 animate-fade-in">
                  <h5 className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-500">Neural Workspace Initialized</h5>
                  <p className="text-[11px] font-sans text-zinc-400 leading-relaxed bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-800/60 max-h-28 overflow-y-auto custom-scrollbar">
                    {agent.systemDirective}
                  </p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    style={{
                      background: msg.sender === 'user' ? `linear-gradient(135deg, ${primary}, ${primary}dd)` : 'rgba(255,255,255,0.04)',
                      borderColor: msg.sender === 'user' ? 'transparent' : 'rgba(255,255,255,0.06)',
                      borderRadius: radius,
                      borderBottomRightRadius: msg.sender === 'user' ? '4px' : radius,
                      borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : radius,
                    }}
                    className="p-3 text-xs text-left text-zinc-200 leading-relaxed font-sans shadow-md border max-w-[85%]"
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 p-2 bg-white/[0.02] border border-white/[0.04] w-14 justify-center rounded-xl animate-pulse">
                  <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Composition Input Form Row */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/80 bg-zinc-900/40 flex gap-2 shrink-0 items-center">
              <input
                type="text"
                placeholder="Type your parameter query..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
                className="flex-1 bg-white/[0.02] border border-zinc-800/80 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-zinc-700 font-sans transition-all placeholder:text-zinc-600"
              />
              <button 
                type="submit" 
                style={{ backgroundColor: primary }} 
                className="h-9 w-9 text-white rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shadow-md shrink-0"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}