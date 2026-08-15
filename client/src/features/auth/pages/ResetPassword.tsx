import React, { useState, useRef, type ClipboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, ShieldCheck, Lock, ArrowLeft, ChevronRight, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
    const { requestResetOTP, verifyResetOTP, resetPassword, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    if (!location.state?.fromLogin) {
        return <Navigate to="/login" replace />;
    }

    const handleSendOTP = async () => {
        if (!email) return toast.error("Email coordinate required");
        const res = await requestResetOTP({ email });
        if (res.success) {
            toast.success("Verification packet injected to node link");
            setStep(2);
        } else {
            toast.error(res.message || "Token broadcast failed");
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^[0-9]{6}$/.test(pasteData)) return;
        setOtp(pasteData.split(""));
        inputsRef.current[5]?.focus();
    };

    const handleVerifyOTP = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) return toast.error("Complete the 6-digit handshake sequence");

        const res = await verifyResetOTP({ email, otp: finalOtp });
        if (res.success) {
            toast.success("Token handshakes validated successfully");
            setStep(3);
        } else {
            toast.error(res.message || "Invalid payload check");
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) return toast.error("Encryption token length too short");
        const res = await resetPassword({ email, otp: otp.join(""), newPassword });
        if (res.success) {
            toast.success("Core authorization token rewritten cleanly");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            toast.error(res.message || "Re-write routine failure");
        }
    };

    const maskEmail = (email: string) => {
        if (!email) return "";
        const [user, domain] = email.split("@");
        if (user.length <= 2) return `${user}***@${domain}`;
        return `${user.substring(0, 3)}••••••••${user.slice(-1)}@${domain}`;
    };

    return (
        <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#7c3aed]/30">
            {/* Background Atmosphere Matrix */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#7c3aed]/5 blur-[140px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#03b5d3]/5 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                {/* Micro Routing Progress Index Line */}
                <div className="flex gap-2 mb-8 px-1">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-[#7c3aed] shadow-[0_0_10px_rgba(124,58,237,0.4)]" : "bg-[#262a35]"}`}
                        />
                    ))}
                </div>

                <div className="glass-card bg-[#111827]/50 border border-[#1f2937] p-8 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* --- PIPELINE 1: DISPATCH ENCRYPTION --- */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#7c3aed]/20 text-[#d2bbff]">
                                        <Mail size={22} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight font-heading">Recover Encryption</h2>
                                    <p className="text-[#ccc3d8] text-xs font-body">Broadcast a recovery request to your network node endpoint.</p>
                                </div>

                                <div className="space-y-4 font-body">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccc3d8] ml-1">Node Address (Email)</label>
                                        <input
                                            type="email" placeholder="operator@company.com" value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-dark w-full px-4 py-3 text-xs"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendOTP} disabled={loading}
                                        className="w-full btn-primary py-4 font-bold flex items-center justify-center gap-2 font-body"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Broadcast Recovery Token <ChevronRight size={18} /></>}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* --- PIPELINE 2: HANDSHAKE ATTRIBUTE CHECK --- */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#7c3aed]/20 text-[#d2bbff]">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight font-heading">Validate Token</h2>
                                    <p className="text-xs text-[#ccc3d8] font-body">
                                        Packet delivered to endpoint structure:{" "}
                                        <span className="text-[#4cd7f6] font-mono block mt-1 italic">{maskEmail(email)}</span>
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index} type="text" maxLength={1} value={digit}
                                                ref={(el) => {inputsRef.current[index] = el}}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#0a0e18]/60 border border-[#1f2937] text-white focus:outline-none focus:ring-4 focus:ring-[#7c3aed]/10 focus:border-[#7c3aed]/50 transition-all font-mono"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleVerifyOTP} disabled={loading}
                                        className="w-full btn-primary py-4 font-bold flex items-center justify-center gap-2 font-body"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Authorize Verification Packet"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* --- PIPELINE 3: REWRITE COMPILATION --- */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-[#03b5d3]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#03b5d3]/20 text-[#4cd7f6]">
                                        <KeyRound size={22} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight font-heading">Rewrite Token Key</h2>
                                    <p className="text-xs text-[#ccc3d8] font-body">Configure replacement master keys inside the auth registry block.</p>
                                </div>

                                <div className="space-y-4 font-body">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccc3d8] ml-1">New Access Key</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                            <input
                                                type="password" placeholder="••••••••" value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-[#0a0e18]/50 border border-[#1f2937] rounded-xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-4 focus:ring-[#03b5d3]/10 focus:border-[#03b5d3]/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleResetPassword} disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#03b5d3] to-[#004e5c] hover:opacity-90 text-white py-4 rounded-xl font-bold shadow-lg shadow-[#03b5d3]/10 font-body transition-transform active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Commit Token Modification"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Return Route Control Footer */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center font-body text-sm">
                    <button
                        onClick={() => navigate("/login")}
                        className="group inline-flex items-center gap-2 text-[#ccc3d8] hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Command Login
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;