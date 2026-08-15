import { motion } from 'framer-motion';
import { FileText, TableProperties, Link2 } from 'lucide-react';

export function KnowledgeCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 70, delay: 0.2 }}
      className="absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 w-[250px] bg-[#111827]/90 backdrop-blur-xl p-5 border border-white/10 rounded-xl shadow-2xl z-20 space-y-4"
    >
      <div className="space-y-3 font-body text-sm">
        <div className="flex items-center gap-3 text-[#dfe2f1]"><FileText className="h-4 w-4 text-[#ffafd3]" /> PDF</div>
        <div className="flex items-center gap-3 text-[#dfe2f1]"><TableProperties className="h-4 w-4 text-[#4cd7f6]" /> CSV</div>
        <div className="flex items-center gap-3 text-[#dfe2f1]"><Link2 className="h-4 w-4 text-[#d2bbff]" /> URL</div>
      </div>

      <div className="space-y-1.5 pt-4 border-t border-white/5 font-mono">
        <div className="flex justify-between text-[12px] text-[#ccc3d8]">
          <span>Knowledge Base</span>
          <span className="text-[#d2bbff]">85%</span>
        </div>
        <div className="h-1.5 w-full bg-[#171b26] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
          />
        </div>
      </div>
    </motion.div>
  );
}