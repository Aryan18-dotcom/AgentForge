import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

const loadingSteps = [
  "Initializing master node allocation vectors...",
  "Establishing secure sandbox tunnel routing handshakes...",
  "Compiling neural model backbone weight matrix charts...",
  "Injecting document context streams into vector RAG memory...",
  "Synchronizing primary UI layout design parameters...",
  "Optimizing creativity temperature boundary limitations...",
  "Broadcasting cluster configuration to production nodes...",
  "Verifying baseline token security signature handshakes..."
];

export default function CustomeLoader() {
  const [currentText, setCurrentText] = useState(loadingSteps[0]);

  // Loop through random system log readouts continuously while active
  useEffect(() => {
    const textInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingSteps.length);
      setCurrentText(loadingSteps[randomIndex]);
    }, 1200);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0f131d]/70 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 select-none rounded-xl">
      
      {/* GLOWING CENTER COMPILATION ORB */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Pulsing Aura */}
        <div className="absolute w-24 h-24 bg-[#7c3aed]/20 rounded-full blur-xl animate-pulse" />
        
        {/* Hardware Spin Ring 1 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute w-20 h-20 border-2 border-dashed border-[#4cd7f6]/30 border-t-[#4cd7f6] rounded-full"
        />

        {/* Hardware Spin Ring 2 (Counter Rotated) */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute w-16 h-16 border border-dashed border-[#7c3aed]/40 border-b-[#7c3aed] rounded-full"
        />

        {/* Center Static Core Asset Icon */}
        <div className="relative w-11 h-11 bg-[#171b26] border border-[#1f2937] rounded-xl flex items-center justify-center text-[#4cd7f6] shadow-lg">
          <Cpu size={20} className="animate-pulse" />
        </div>
      </div>

      {/* COMPILATION META DESCRIPTIONS */}
      <div className="text-center space-y-3 max-w-sm w-full">
        <div className="space-y-1">
          <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
            Forging Cluster Arrays
          </h3>
          <p className="text-[10px] font-mono text-[#4cd7f6] uppercase tracking-widest ai-status-pulse">
            Compilation Routine Active
          </p>
        </div>

        {/* STREAMING ANCHOR LOG MESSAGES */}
        <div className="h-10 flex items-center justify-center bg-[#0a0e18]/60 border border-[#1f2937] rounded-xl px-4 py-2 font-mono text-[11px] text-[#ccc3d8] shadow-inner overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentText}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="truncate text-center w-full"
            >
              {currentText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* HUD HARDWARE TRACK BAR */}
        <div className="h-1 w-full bg-[#171b26] rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            initial={{ left: "-30%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#4cd7f6] to-transparent absolute"
          />
        </div>
      </div>
    </div>
  );
}