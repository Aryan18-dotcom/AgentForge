import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { LogIn, ArrowRight, Cpu, Activity, Terminal, Radio, Loader2 } from "lucide-react";
import type { LoginPayload, LoginResponse } from "../../../types/auth.js";

interface StatBoxProps {
  label: string;
  value: string;
  color: "violet" | "cyan" | "pink";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { loading, handleLogin, user } = useAuth() as { 
    loading: boolean; 
    handleLogin: (data: any) => Promise<{ success: boolean; message?: string }> 
    user: LoginPayload | null;
  };

  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await handleLogin(formData) as LoginResponse;
    if (!result.success) {
      toast.error(result.message || "Invalid credentials");
      return;
    }
    toast.success("Welcome back!");
    if (result.user) {
        navigate("/dashboard");
    }
  };

  // --- AUTOMATIC SESSION REDIRECT LIFE-CYCLE ---
  if (user) {
    return <SessionRedirectBuffer navigate={navigate} />;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex overflow-hidden relative"
    >
      {/* GLOBAL DOT BACKGROUND */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#4a4455 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
      />

      {/* AMBIENT INTELLIGENCE GLOWS */}
      <div className="fixed -top-24 -left-24 w-[450px] h-[450px] bg-[#7c3aed]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[450px] h-[450px] bg-[#03b5d3]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* LEFT SIDE - 40% (LOGIN CONTROL CONTROLLER) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="w-full lg:w-[40%] flex items-center justify-center p-8 z-10 border-r border-[#1f2937] bg-[#0a0e18]/60 backdrop-blur-md"
      >
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6] rounded-xl flex items-center justify-center shadow-lg shadow-[#7c3aed]/20"
            >
              <LogIn className="text-white" size={22} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-heading">Forge Engine</h1>
            <p className="text-[#ccc3d8] text-sm font-body">Initialize authorization sequence to manage model pipelines.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Developer Identifier"
                name="userId"
                placeholder="Username or verification email"
                value={formData.userId}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <Input
                  label="Security Token (Password)"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  onClick={() => navigate("/reset-password", { state: { fromLogin: true } })} 
                  type="button" 
                  className="text-xs text-[#d2bbff] hover:text-[#4cd7f6] transition-colors font-body ml-1"
                >
                  Trouble resolving encryption token?
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-body cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
              {loading ? "Authenticating Grid..." : "Synchronize Workspace"}
              {!loading && <ArrowRight size={18} />}
            </motion.button>

            <div className="text-center pt-4 border-t border-[#4a4455]/40">
              <p className="text-sm text-[#ccc3d8] font-body">
                New cluster operator?{" "}
                <Link to="/register" className="text-[#4cd7f6] font-bold hover:text-[#d2bbff] transition-colors ml-1">
                  Provision Cluster
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* RIGHT SIDE - 60% (KINETIC COMMAND OVERLAY VISUALS) */}
      <div className="hidden lg:flex lg:w-[60%] relative items-center justify-center p-12 overflow-hidden bg-[#0f131d]">
        <motion.div
          style={{
            x: mousePos.x * 25,
            y: mousePos.y * 25,
            rotateX: mousePos.y * -4,
            rotateY: mousePos.x * 4
          }}
          className="relative w-full max-w-2xl grid grid-cols-2 gap-6"
        >
          {/* Main Core Neural Hub Container */}
          <div className="col-span-2 glass-card p-8 bg-[#111827]/40 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#7c3aed]/10 rounded-xl text-[#d2bbff] border border-[#7c3aed]/20">
                  <Cpu size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Neural Workspace Active</h3>
                  <p className="text-sm text-[#ccc3d8] font-body">Dynamic context RAG synchronization online.</p>
                </div>
              </div>
              <span className="flex items-center gap-2 text-[11px] font-mono bg-[#03b5d3]/10 border border-[#03b5d3]/20 text-[#4cd7f6] px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Radio size={12} className="animate-pulse" /> Live Flux
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Active Clusters" value="1,482" color="violet" />
              <StatBox label="Model Ingress" value="99.4%" color="cyan" />
              <StatBox label="Queue Latency" value="14ms" color="pink" />
            </div>
          </div>

          {/* Micro Telemetry Graph Modules */}
          <div className="glass-card p-6 bg-[#111827]/40 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white font-heading flex items-center gap-2">
                <Activity size={14} className="text-[#4cd7f6]" /> Compute Stability
              </span>
              <span className="ai-status-pulse">Stable</span>
            </div>
            <div className="h-20 flex items-end gap-1.5 pt-2">
              {[0.4, 0.75, 0.5, 0.9, 0.65, 0.35, 0.8].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 100}%`, `${Math.random() * 60 + 40}%`, `${h * 100}%`] }}
                  transition={{ repeat: Infinity, duration: 2.5 + i * 0.2, ease: "easeInOut" }}
                  className="flex-1 bg-gradient-to-t from-[#7c3aed]/20 to-[#4cd7f6]/60 rounded-t-sm"
                />
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-[#111827]/40 border border-[#1f2937] space-y-4">
            <div className="flex items-center gap-2.5">
              <Terminal size={16} className="text-[#ffafd3]" />
              <span className="text-xs font-bold text-[#dfe2f1] font-heading">Active Job Matrix</span>
            </div>
            <div className="space-y-2 font-mono">
              <div className="h-1.5 w-full bg-[#171b26] rounded-full overflow-hidden relative border border-white/5">
                <motion.div 
                  animate={{ x: [-120, 240] }} 
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }} 
                  className="w-1/3 h-full bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6]" 
                />
              </div>
              <p className="text-[10px] text-[#ccc3d8]">Parsing Vector: <span className="text-[#4cd7f6]">#FORGE-8829-X</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: HIGH PERFORMANCE GLASS REDIRECT BUFFER ANIMATION ---
function SessionRedirectBuffer({ navigate }: { navigate: any }) {
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 1200);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#0f131d] flex flex-col items-center justify-center p-6 select-none relative">
      {/* Background Matrix Dots */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#4a4455 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
      />
      <div className="absolute w-48 h-48 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-4 relative z-10">
        <div className="relative flex items-center justify-center mx-auto mb-2">
          {/* Neon Rotation Spinner loops */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-12 border-2 border-dashed border-[#4cd7f6]/20 border-t-[#4cd7f6] rounded-full absolute"
          />
          <div className="w-8 h-8 bg-[#111827] border border-[#1f2937] rounded-lg flex items-center justify-center text-[#7c3aed]">
            <Cpu size={16} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
            Resolving Authentication Context
          </h2>
          <p className="text-[10px] font-mono text-[#ccc3d8] uppercase tracking-widest ai-status-pulse">
            Redirecting to secure terminal...
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: StatBoxProps) {
  const colorMap = {
    violet: "text-[#d2bbff]",
    cyan: "text-[#4cd7f6]",
    pink: "text-[#ffafd3]"
  };
  
  return (
    <div className="bg-[#0a0e18]/50 p-4 rounded-xl border border-[#4a4455]/40 font-mono">
      <p className="text-[10px] uppercase tracking-wider text-[#ccc3d8] mb-1 font-semibold">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full text-left font-body">
      <label className="text-[11px] font-bold text-[#ccc3d8] uppercase tracking-widest ml-1 font-mono">
        {label}
      </label>
      <input
        {...props}
        className="input-dark w-full px-4 py-3.5"
      />
    </div>
  );
}