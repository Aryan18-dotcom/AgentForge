import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, LogOut, ChevronRight, Settings2, Bell, Lock, 
  HardDrive, Globe, Eye, HelpCircle, AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useGlobalNavigate } from '../../../hooks/NavigationProvider';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';

export default function Settings() {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useGlobalNavigate();

  // Local state for toggles to make the standard page feel interactive
  const [pushNotif, setPushNotif] = useState(true);
  // const [emailNotif, setEmailNotif] = useState(false);
  const [telemetry, setTelemetry] = useState(true);

  const handleLogoutFunction = async () => {
    await handleLogout();
    navigate('/login');
  };

  console.log(JSON.stringify(user))

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center font-mono text-xs text-[#4cd7f6] bg-[#030712]/20 rounded-2xl border border-[#1f2937]/30 backdrop-blur-md">
        <div className="h-8 w-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(124,58,237,0.3)]" />
        <span>DECRYPTING SETTINGS MATRIX DATA...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full font-body pb-16 text-left select-none relative max-w-4xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-[#1f2937] pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings2 size={24} className="text-[#7c3aed]" /> Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your account preferences, configurations, and system options.</p>
      </div>

      <motion.div 
        variants={staggerContainer} initial="hidden" animate="visible"
        className="space-y-6"
      >
        {/* PROFILE/ACCOUNT HEADER BANNER LINK */}
        <motion.div 
          variants={fadeInUp}
          onClick={() => navigate('/profile')}
          className="w-full bg-[#111827]/40 border border-[#1f2937] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#4cd7f6]/40 transition-all duration-200"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-[#0a0e18] border border-[#1f2937] overflow-hidden flex items-center justify-center text-[#d2bbff] shrink-0 relative">
              {user?.profilePictureUrl ? (
                <img 
                  src={user.profilePictureUrl} 
                  alt={user?.fullName || "User Avatar"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} className="opacity-70 group-hover:scale-105 transition-transform" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[#4cd7f6] transition-colors">
                {user?.fullName || 'Operator Profile'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">
                {user?.email || 'Configure identity context credentials'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors text-xs font-mono">
            <span>View Profile</span>
            <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>

        {/* SETTINGS GROUP 1: ACCOUNT & SECURITY */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-1">Account & Security</h3>
          <div className="bg-[#111827]/20 border border-[#1f2937] rounded-xl overflow-hidden divide-y divide-[#1f2937]/60">
            
            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-[#7c3aed]" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Authentication Password</span>
                  <span className="text-[10px] text-zinc-500">Update your security pass credentials</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>

            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-emerald-500" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Two-Factor Authentication</span>
                  <span className="text-[10px] text-zinc-500">Add an extra verification layer to your node access</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">Unconfigured</span>
            </div>

          </div>
        </motion.div>

        {/* SETTINGS GROUP 2: PREFERENCES & ENVIRONMENT */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-1">App Preferences</h3>
          <div className="bg-[#111827]/20 border border-[#1f2937] rounded-xl overflow-hidden divide-y divide-[#1f2937]/60">
            
            {/* Toggle Row 1 */}
            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Push Notification Matrix</span>
                  <span className="text-[10px] text-zinc-500">Receive system metrics and alert signals instantly</span>
                </div>
              </div>
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={`w-8 h-4 rounded-full p-0.5 border transition-colors flex items-center cursor-pointer ${
                  pushNotif ? 'bg-[#4cd7f6]/20 border-[#4cd7f6]/40 justify-end' : 'bg-[#1f2937] border-[#374151] justify-start'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full shadow-xs transition-colors ${pushNotif ? 'bg-[#4cd7f6]' : 'bg-zinc-500'}`} />
              </button>
            </div>

            {/* Toggle Row 2 */}
            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-[#4cd7f6]" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">System Language</span>
                  <span className="text-[10px] text-zinc-500">Select regional display string tables</span>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-[#0a0e18] border border-[#1f2937] px-2.5 py-1 rounded-lg">English (US)</span>
            </div>

            {/* Toggle Row 3 */}
            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Telemetry Diagnostics</span>
                  <span className="text-[10px] text-zinc-500">Share anonymous performance logs to help patch modules</span>
                </div>
              </div>
              <button 
                onClick={() => setTelemetry(!telemetry)}
                className={`w-8 h-4 rounded-full p-0.5 border transition-colors flex items-center cursor-pointer ${
                  telemetry ? 'bg-[#4cd7f6]/20 border-[#4cd7f6]/40 justify-end' : 'bg-[#1f2937] border-[#374151] justify-start'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full shadow-xs transition-colors ${telemetry ? 'bg-[#4cd7f6]' : 'bg-zinc-500'}`} />
              </button>
            </div>

          </div>
        </motion.div>

        {/* SETTINGS GROUP 3: SYSTEM UTILITIES */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-1">System Infrastructure</h3>
          <div className="bg-[#111827]/20 border border-[#1f2937] rounded-xl overflow-hidden divide-y divide-[#1f2937]/60">
            
            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <HardDrive size={16} className="text-[#a78bfa]" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Vector Cache Management</span>
                  <span className="text-[10px] text-zinc-500">Flush operational context buffers to free workspace bounds</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-[#1f2937] border border-[#374151] px-2 py-0.5 rounded">4.2 MB Allocated</span>
            </div>

            <div className="p-3.5 flex items-center justify-between hover:bg-[#111827]/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-zinc-400" />
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Documentation & Support</span>
                  <span className="text-[10px] text-zinc-500">Access systemic manual logs and architecture protocols</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>

          </div>
        </motion.div>

        {/* LOGOUT AREA BOX */}
        <motion.div variants={fadeInUp} className="pt-4">
          <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <AlertTriangle size={13} /> Active Session Termination
              </span>
              <span className="text-[11px] text-zinc-400 block">
                Disconnect your current web client device vector completely from this authenticated application node.
              </span>
            </div>
            
            <button 
              onClick={handleLogoutFunction}
              className="w-full sm:w-auto px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-500/40 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <LogOut size={13} className="transform group-hover:-translate-x-0.5 transition-transform" /> 
              Log Out Session
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}