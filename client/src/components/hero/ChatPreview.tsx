import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: "Hello! I've analyzed the Q3 data. The trends show a 15% growth in user engagement. How would you like to visualize this?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // ✅ FIXED: Create a ref to manage the scroll view container directly
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Restrict scrolling math to the inner container wrapper only
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isThinking]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputValue.trim() || isThinking) return;

    const userMessageText = inputValue.trim();
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `As your AgentForge assistant, I've logged your request: "${userMessageText}". Connecting to your live knowledge nodes to execute this strategy.`
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Failed to fetch agent stream:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 70, delay: 0.4 }}
      className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 w-[320px] h-[400px] bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 select-none"
    >
      {/* Top Utility Header Bar */}
      <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#4cd7f6]/20 px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-white flex items-center gap-2 font-body">
          <MessageSquare className="h-3.5 w-3.5 text-[#d2bbff]" /> Assistant
        </span>
        <div className="flex items-center gap-1.5">
          {isThinking && (
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#4cd7f6] uppercase ai-status-pulse mr-1">
              Thinking
            </span>
          )}
          <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isThinking ? 'bg-[#ffafd3]' : 'bg-[#4cd7f6]'}`} />
        </div>
      </div>

      {/* Dynamic Conversational Output Feed */}
      {/* ✅ FIXED: Bound scroll context ref tracking to this individual div layer */}
      <div 
        ref={scrollContainerRef} 
        className="flex-1 p-4 space-y-4 font-body text-xs overflow-y-auto custom-scrollbar bg-black/10"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center shrink-0">
                  <Bot className="h-3 w-3 text-[#d2bbff]" />
                </div>
              )}
              
              <div 
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed font-sans ${
                  msg.sender === 'user' 
                    ? 'bg-[#7c3aed]/40 text-white rounded-tr-none border border-[#7c3aed]/30' 
                    : 'bg-white/5 text-[#ccc3d8] rounded-tl-none border border-white/[0.03]'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-[#4cd7f6]/20 border border-[#4cd7f6]/30 flex items-center justify-center shrink-0">
                  <User className="h-3 w-3 text-[#4cd7f6]" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Animated Processing State UI */}
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 items-center"
            >
              <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center shrink-0">
                <Bot className="h-3 w-3 text-[#d2bbff]" />
              </div>
              <div className="bg-white/5 px-4 py-3 rounded-xl rounded-tl-none flex gap-1 items-center justify-center h-7 border border-white/[0.02]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc3d8] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc3d8] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc3d8] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Action Form Tray */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 border-t border-white/10 bg-white/5 flex items-center gap-2 shrink-0 relative"
      >
        <div className="flex-1 relative flex items-center">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isThinking}
            // ✅ FIXED: Clear out all implicit automated browser selection overrides
            autoComplete="off"
            className="input-dark w-full h-8 rounded-full pl-4 pr-4 text-xs focus:outline-none disabled:opacity-50 font-sans bg-zinc-950/40 border border-white/5"
          />
          
          {!inputValue && (
            <div className="absolute left-4 pointer-events-none text-xs text-zinc-500 font-sans flex items-center gap-0.5">
              <span>{isThinking ? "Agent is processing..." : "Ask your AI workforce"}</span>
            </div>
          )}
        </div>

        <motion.button 
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          whileHover={inputValue.trim() && !isThinking ? { scale: 1.05 } : {}}
          whileTap={inputValue.trim() && !isThinking ? { scale: 0.95 } : {}}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4cd7f6] flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
        >
          <Send className="h-3.5 w-3.5 text-white" />
        </motion.button>
      </form>
    </motion.div>
  );
}