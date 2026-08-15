import { Cpu } from 'lucide-react';
import { AnimatedButton } from '../common/AnimationButton';
import { useGlobalNavigate } from '../../hooks/NavigationProvider';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function Navbar() {
  const navigate = useGlobalNavigate();
  const { user } = useAuth();
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f131d]/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] flex items-center justify-center shadow-lg shadow-[#7c3aed]/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <button className="font-bold text-xl tracking-tight text-white font-heading" onClick={()=>{navigate('/')}}>
            AgentForge
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-body text-sm">
          <a href="#features" className="text-[#d2bbff] font-semibold border-b-2 border-[#7c3aed] pb-1">Features</a>
          <a href="#pricing" className="text-[#ccc3d8] hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="text-[#ccc3d8] hover:text-white transition-colors">Docs</a>
        </div>

        {user ? (
          <AnimatedButton onClick={() => navigate('/dashboard')} className="ml-4 px-4 py-2 bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] text-white rounded-lg shadow-lg shadow-[#7c3aed]/20 hover:from-[#7c3aed]/90 hover:to-[#4cd7f6]/90 transition-colors">
            Dashboard
          </AnimatedButton>
        ) : (
          <AnimatedButton onClick={() => navigate('/login')} variant="primary" className="!rounded-xl">
            Start Building
          </AnimatedButton>
        )}
      </div>
    </nav>
  );
}