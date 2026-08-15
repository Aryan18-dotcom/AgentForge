import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import {
  ChevronRight, User, Network,
  Mail, ArrowLeft, Loader2, ShieldCheck,
  CheckCircle2, Terminal, Sparkles
} from "lucide-react";
import type { LoginResponse } from "../../../types/auth.js";

export default function Register() {
  const navigate = useNavigate();
  const { loading, verifyAndRegister, requestOTP } = useAuth();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  // Simplified and updated data model fields mapping perfectly to your requirements
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    useCase: "professional",
    workSpaceType: "Personal",
    organizationName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors.includes(e.target.name)) {
      setFieldErrors(prev => prev.filter(f => f !== e.target.name));
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // STEP 1 Validation & Handshake Trigger 
  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(['confirmPassword']);
      return toast.error("Passwords do not match");
    }

    // Using full name as username string for legacy API alignment if necessary
    console.log("Requesting registration OTP with:", { username: formData.userName, email: formData.email });
    const res = await requestOTP({ username: formData.userName, email: formData.email });

    if (res.success) {
      toast.success("Verification payload sent to email array");
      nextStep();
    } else {
      if (res.message.toLowerCase().includes("email")) setFieldErrors(p => [...p, "email"]);
      toast.error(res.message);
    }
  };

  // STEP 2 Processing Form Intercept
  const handleStepTwo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.useCase) {
      return toast.error("Please select a target use case matrix configuration");
    }
    nextStep();
  };

  // STEP 3 Core Verification & Dynamic Final Registration Submission
  const handleFinalSubmit = async (e: React.FormEvent, skipped = false) => {
    if (e) e.preventDefault();

    if (otp.length < 6) return toast.error("Please enter a valid 6-digit OTP verification token");

    // Dynamic payload fallback modification if operator chose to bypass step 3 org configs
    const submissionPayload = {
      ...formData,
      organizationName: skipped ? "Personal Workspace" : formData.organizationName ? formData.organizationName : "Personal Workspace", // Default to Personal Workspace if skipped or left blank
      targetClassification: formData.useCase === "personal" ? "SandBox Testing" : formData.useCase === "professional" ? "FreeLance/Solo" : "Team Orchestration",
      workSpaceType: formData.useCase === "Experience" ? "Organization" : "Personal",
      otp
    };

    console.log("Submitting registration payload:", submissionPayload);
    const res = await verifyAndRegister(submissionPayload) as LoginResponse;

    if (res.success) {
      toast.success("Cluster identity verified. Initializing neural workspace.");
      navigate("/dashboard");
      setTimeout(() => {
        toast.success(
          "Welcome to the Forge! 10 free agent tokens provisioned. Visit Subscription for Experience plans and top-ups.",
          { duration: 4000 }
        );
      }, 1500);

    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex items-center justify-center p-6 selection:bg-[#7c3aed]/30 relative overflow-hidden">
      {/* BACKGROUND LUMINOUS GRADIENT FIELD */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#7c3aed]/5 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="w-full max-w-6xl grid lg:grid-cols-12 gap-12 items-center z-10"
      >
        {/* LEFT: System Infrastructure Capabilities Column */}
        <div className="lg:col-span-5 space-y-8 hidden lg:block">
          <div className="space-y-4">
            <span className="px-3 py-1.5 rounded-full border border-[#7c3aed]/30 text-[#d2bbff] text-xs font-semibold bg-[#7c3aed]/5 font-mono tracking-wider uppercase">
              Identity Matrix Setup
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white leading-tight font-heading">
              Forge Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6]">Virtual Core.</span>
            </h1>
            <p className="text-[#ccc3d8] text-base leading-relaxed font-body">
              Provision production-grade autonomous agent clusters mapped fully to your vector architecture and datasets.
            </p>
          </div>

          <div className="space-y-6">
            <FeatureItem icon={<ShieldCheck size={20} />} title="Vector Isolation" desc="Hardware token validation guarantees sandboxed deployment environments." />
            <FeatureItem icon={<Network size={20} />} title="Omni-Channel RAG Injection" desc="Instantly hook pipeline grids into documents, custom APIs, or CRM models." />
            <FeatureItem icon={<CheckCircle2 size={20} />} title="White-Label Layout Control" desc="Inject custom typography, tokens, and styling curves dynamically into widget instances." />
          </div>

          <div className="glass-card p-5 bg-[#111827]/30 border border-[#1f2937] backdrop-blur-sm">
            <p className="text-xs font-mono text-[#ccc3d8] italic leading-relaxed flex gap-2">
              <Terminal size={14} className="text-[#4cd7f6] shrink-0" />
              "Steps 1 and 2 define core node metrics and remain mandatory. Experience infrastructure parameters on Step 3 can be modified later."
            </p>
          </div>
        </div>

        {/* RIGHT: High-Fidelity Multi-Step Config Module */}
        <div className="lg:col-span-7 w-full">
          <div className="glass-card bg-[#111827]/50 border border-[#1f2937] p-8 sm:p-10 backdrop-blur-md relative overflow-hidden shadow-2xl">

            {/* Horizontal Flow Segment Indicators */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? "bg-[#7c3aed] shadow-[0_0_10px_rgba(124,58,237,0.5)]" : "bg-[#262a35]"}`}
                  />
                ))}
              </div>
              <span className="text-[#ccc3d8] text-xs font-mono font-bold uppercase tracking-widest">Pipeline 0{step}</span>
            </div>

            <AnimatePresence mode="wait">
              {/* --- STEP 1: IDENTITY ACCESS CREDENTIALS --- */}
              {step === 1 && (
                <motion.form
                  key="step1" initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }}
                  onSubmit={handleStepOne} className="space-y-5"
                >
                  <div className="space-y-1 mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                      <User size={18} className="text-[#7c3aed]" /> Operator Profile
                    </h2>
                    <p className="text-[#ccc3d8] text-xs font-body">Assemble primary identity matrix keys.</p>
                  </div>

                  <Input label="User Name" name="userName" value={formData.userName} onChange={handleChange} placeholder="e.g. John Doe" />
                  <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
                  <Input label="Master Endpoint Email" type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={fieldErrors.includes("email")} placeholder="operator@company.com" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Access Key" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    <Input label="Verify Access Key" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isInvalid={fieldErrors.includes("confirmPassword")} placeholder="••••••••" />
                  </div>

                  <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2 font-body cursor-pointer">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue: Configuration Context <ChevronRight size={18} /></>}
                  </button>
                </motion.form>
              )}

              {/* --- STEP 2: USE CASE MATRIX SELECTION --- */}
              {step === 2 && (
                <motion.form
                  key="step2" initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }}
                  onSubmit={handleStepTwo} className="space-y-5"
                >
                  <div className="space-y-1 mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                      <Sparkles size={18} className="text-[#7c3aed]" /> Execution Context
                    </h2>
                    <p className="text-[#ccc3d8] text-xs font-body">Designate the deployment allocation type for your agents.</p>
                  </div>

                  <div className="space-y-2 text-left font-body">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">Target Classification</label>
                    <div className="relative">
                      <select
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleChange}
                        className="w-full bg-[#0a0e18]/50 border border-[#1f2937] focus:ring-[#7c3aed]/50 focus:border-[#7c3aed]/50 text-white rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:ring-4 appearance-none cursor-pointer"
                      >
                        <option value="personal">Personal Ecosystem (Sandbox Testing)</option>
                        <option value="professional">Professional Application (Freelance/Solo Dev)</option>
                        <option value="Experience">Experience Scaled Infrastructure (Team Orchestration)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#ccc3d8]">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 font-body text-sm">
                    <button type="button" onClick={prevStep} className="flex-1 bg-[#171b26] border border-[#4a4455] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#262a35] transition-colors text-white cursor-pointer"><ArrowLeft size={18} /> Back</button>
                    <button type="submit" className="flex-[2] btn-primary py-4 flex items-center justify-center gap-2 cursor-pointer">Verify Infrastructure Node <ChevronRight size={18} /></button>
                  </div>
                </motion.form>
              )}

              {/* --- STEP 3: INFRASTRUCTURE ROUTING & VERIFICATION --- */}
              {step === 3 && (
                <motion.div
                  key="step3" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl flex items-center justify-center mx-auto mb-2 text-[#d2bbff]">
                    <Mail size={28} />
                  </div>
                  <div className="space-y-1 text-center">
                    <h2 className="text-xl font-bold text-white font-heading">Validate Cluster Encryption</h2>
                    <p className="text-xs text-[#ccc3d8] font-body">Verification packet dispatched to <span className="text-[#4cd7f6] font-mono">{formData.email}</span></p>
                  </div>

                  {/* Optional Field: Users can choose to skip configuring an Org, but must provide the verification OTP */}
                  <div className="text-left space-y-4 pt-2">
                    <Input
                      label="Organization/Workspace Name (Optional - Click Skip Below)"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Corp"
                      required={false} // Override default input requirement
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#ccc3d8] ml-1">6-Digit Handshake Token</label>
                    <input
                      type="text" maxLength={6} placeholder="••••••"
                      className="w-full bg-[#0a0e18]/60 border border-[#1f2937] rounded-xl px-4 py-4 text-center text-3xl tracking-[0.4em] font-mono focus:border-[#4cd7f6] text-white focus:outline-none focus:ring-4 focus:ring-[#03b5d3]/10 transition-all"
                      value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  {/* Dual Action Layer: Conditional submission allowing step 3 routing bypass */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 font-body">
                    <button
                      type="button"
                      onClick={(e) => handleFinalSubmit(e, true)}
                      disabled={loading || otp.length < 6}
                      className="flex-1 bg-[#171b26] border border-[#4a4455] text-xs py-4 rounded-xl font-bold hover:bg-[#262a35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Skip Org & Complete
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleFinalSubmit(e, false)}
                      disabled={loading || !formData.organizationName.trim() || otp.length < 6}
                      className="flex-[2] btn-primary py-4 text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : "Provision Experience Core"}
                    </button>
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="text-xs text-[#ccc3d8] hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto font-body cursor-pointer">
                    <ArrowLeft size={14} /> Re-configure deployment metadata
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center border-t border-[#4a4455]/30 pt-6 font-body text-sm">
              <p className="text-[#ccc3d8]">
                Token array already mapped?{" "}
                <Link to="/login" className="text-[#7c3aed] font-semibold hover:text-[#d2bbff] ml-1">
                  Authenticate Core
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 font-body">
      <div className="mt-1 text-[#7c3aed]">{icon}</div>
      <div>
        <h4 className="font-semibold text-white font-heading text-sm">{title}</h4>
        <p className="text-xs text-[#ccc3d8] leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Input({ label, isInvalid, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full text-left font-body">
      <label className={`text-[10px] font-bold font-mono uppercase tracking-widest ml-1 ${isInvalid ? "text-red-400" : "text-[#ccc3d8]"}`}>
        {label}
      </label>
      <input
        {...props}
        className={`w-full bg-[#0a0e18]/50 border rounded-xl px-4 py-3.5 text-white text-xs transition-all ${isInvalid
          ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500"
          : "border-[#1f2937] focus:ring-[#7c3aed]/10 focus:border-[#7c3aed]/50"
          } focus:outline-none focus:ring-4`}
      />
    </div>
  );
}