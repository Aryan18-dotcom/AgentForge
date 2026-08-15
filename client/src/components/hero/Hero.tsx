import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animation/motionVariants';
import { AnimatedButton } from '../common/AnimationButton';
import { KnowledgeCard } from './KnowlageCard';
import { ChatPreview } from './ChatPreview';
import { useGlobalNavigate } from '../../hooks/NavigationProvider';

export function Hero() {
  const navigate = useGlobalNavigate();
  return (
    <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-full text-[#d2bbff] text-xs font-semibold tracking-widest uppercase font-mono">
          <span className="h-2 w-2 rounded-full bg-[#d2bbff] animate-pulse" /> Next-Gen AI Deployment
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] font-heading">
          An AI Employee Trained on Your Data, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6]">Styled for Your Brand.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-lg text-[#ccc3d8] max-w-xl font-body">
          Deploy context-aware AI widgets in minutes. Fully customizable, white-label, and ready for your business ecosystem.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
          <AnimatedButton variant="primary" className="flex items-center justify-center gap-2 group !py-4 !px-8 text-base !rounded-xl shadow-lg shadow-[#7c3aed]/20" onClick={() => navigate('/build-agent')}>
            Build Your Agent <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedButton>
          <AnimatedButton variant="secondary" className="flex items-center justify-center gap-2 !py-4 !px-8 text-base !rounded-xl">
            <PlayCircle className="h-5 w-5 text-[#ccc3d8]" /> Watch Demo
          </AnimatedButton>
        </motion.div>
      </motion.div>

      <div className="relative h-[500px] w-full flex items-center justify-center">
        <KnowledgeCard />
        <ChatPreview />
      </div>
    </section>
  );
}