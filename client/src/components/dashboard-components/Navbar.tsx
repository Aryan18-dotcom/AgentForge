import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, User, Settings, LogOut, Coins, MessageSquare, ChevronDown, CreditCardIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

const navbarLinks = [
  { name: 'Home', href: '/dashboard' },
  { name: 'Build Agent', href: '/build-agent' },
  { name: 'My Creations', href: '/my-creations' },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 🌟 Extract real-time user data and your new stateless logout action handler
  const { user, handleLogout } = useAuth(); 

  // Close dropdown cleanly if clicking anywhere outside the component box boundary
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-16 bg-[#171b26]/60 backdrop-blur-md border border-[#1f2937] rounded-xl mb-6 flex items-center justify-between px-6 relative z-50 select-none">
      
      {/* BRAND LOGO MODULE */}
      <Link 
        to="/dashboard"
        className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white font-heading cursor-pointer group" 
      >
        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] flex items-center justify-center transition-transform group-hover:scale-105">
          <Cpu className="h-4 w-4 text-white" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#ccc3d8]">
          AgentForge
        </span>
      </Link>

      {/* NAVIGATION INTERFACE ASSEMBLY LAYER */}
      <div className="flex items-center gap-2 relative">
        
        {/* Main Routing Anchors Link Loop */}
        <div 
          className="flex items-center gap-1 relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navbarLinks.map((link, idx) => {
            const isHovered = hoveredIndex === idx;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.name}
                to={link.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg relative transition-colors duration-200 ${
                  isActive ? 'text-[#4cd7f6]' : isHovered ? 'text-white' : 'text-[#ccc3d8]'
                }`}
              >
                {/* SHARED HOVER BACKDROP PILL */}
                {isHovered && (
                  <motion.div
                    layoutId="navHoverPill"
                    className="absolute inset-0 bg-white/5 border border-white/5 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* SHARED ACTIVE UNDERLINE INDICATOR */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveLine"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}

                {link.name}
              </Link>
            );
          })}
        </div>

        {/* 🌟 NEW: INTERACTIVE PROFILE DROP-DOWN MODULE */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isDropdownOpen 
                ? 'bg-[#1f2937] border-zinc-500 text-white' 
                : 'bg-white/5 border-[#1f2937] text-[#ccc3d8] hover:text-white hover:border-zinc-700'
            }`}
          >
            <div className="h-5 w-5 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#d2bbff]">
              <User size={12} />
            </div>
            <span className="max-w-[90px] truncate">{user?.username || 'Operator'}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#4cd7f6]' : 'text-zinc-500'}`} />
          </button>

          {/* DROP-DOWN DRAWER CONSOLE */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-64 bg-[#0d111a] border border-[#1f2937] rounded-xl shadow-2xl p-4 space-y-3 z-50 overflow-hidden"
              >
                {/* 📊 CLUSTER METRICS DISPLAY SUB-BENTO BLOCK */}
                <div className="bg-[#060811]/60 border border-[#1f2937] rounded-lg p-3 space-y-2.5 font-mono text-[10px]">
                  <div className="text-zinc-500 font-bold uppercase tracking-wider border-b border-white/[0.04] pb-1">
                    System Node Telemetry
                  </div>
                  
                  {/* Setup pool wallet token count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#ccc3d8]">
                      <Coins size={12} className="text-[#a78bfa]" />
                      <span>Setup Pool:</span>
                    </div>
                    <span className="text-white font-bold">
                      {user?.agentCreationToken !== undefined ? user.agentCreationToken : 0} Credits
                    </span>
                  </div>

                  {/* Conversational live usage limits balance tracking */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#ccc3d8]">
                      <MessageSquare size={12} className="text-[#4cd7f6]" />
                      <span>Chat Token:</span>
                    </div>
                    <span className="text-[#4cd7f6] font-bold">
                      {user?.chatExecutionToken !== undefined ? user.chatExecutionToken.toLocaleString() : 0}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.04] w-full" />

                {/* NAVIGATION ACTION DIRECTORY LINK LAYER */}
                <div className="flex flex-col gap-0.5 font-mono text-xs">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#ccc3d8] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={14} className="text-zinc-500" />
                    <span>Profile Page</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#ccc3d8] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings size={14} className="text-zinc-500" />
                    <span>Settings Page</span>
                  </Link>

                  <Link
                    to="/subscription"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#ccc3d8] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <CreditCardIcon size={14} className="text-zinc-500" />
                    <span>Subscription Page</span>
                  </Link>
                </div>

                <div className="h-[1px] bg-white/[0.04] w-full" />

                {/* TERMINATION SYSTEM FOOTER BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer text-left"
                >
                  <LogOut size={14} />
                  <span>Terminate Session</span>
                </button>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}