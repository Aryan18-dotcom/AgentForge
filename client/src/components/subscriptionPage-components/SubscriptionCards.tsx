import { useState } from 'react';
import { CreditCard, Zap, Sparkles, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import { usePayment } from '../../features/SubscriptionModel/hooks/usePayment';

interface SubscriptionCardProps {
  name: 'Starter' | 'Growth' | 'Experience';
  priceRs: number;
  creationTokens: number;
  chatTokensText: string;
  features: string[];
  accentColor: string;
  isCurrentPlan?: boolean;
}

export const SubscriptionCard = ({
  name,
  priceRs,
  creationTokens,
  chatTokensText,
  features,
  accentColor,
  isCurrentPlan = false,
}: SubscriptionCardProps) => {
  const { processSubscriptionCheckout, isPaymentLoading, activeProcessingPlan } = usePayment();
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay'>('razorpay');

  const isCurrentPlanProcessing = isPaymentLoading && activeProcessingPlan === name;

  // Approximate USD estimate for international Stripe users
  const usdPrice = (priceRs / 85).toFixed(2);

  return (
    <div 
      className={`glass-card bg-[#111827]/40 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 group ${
        isCurrentPlan 
          ? 'border-2 shadow-2xl bg-[#111827]/75 scale-[1.01]' 
          : 'border border-[#1f2937] hover:border-zinc-700/50'
      }`}
      style={{ 
        borderColor: isCurrentPlan ? accentColor : undefined,
        boxShadow: isCurrentPlan ? `0 0 30px ${accentColor}15` : undefined 
      }}
    >
      {/* Authoritative status badge if the client owns this plan */}
      {isCurrentPlan && (
        <div 
          className="absolute top-0 left-0 text-black font-mono font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-br-xl shadow-md z-10 animate-fade-in flex items-center gap-1"
          style={{ backgroundColor: accentColor }}
        >
          <ShieldCheck size={11} className="text-black" />
          Active Plan
        </div>
      )}

      {/* Popular plan banner */}
      {name === 'Growth' && !isCurrentPlan && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-[#4cd7f6] to-[#7c3aed] text-black font-mono font-bold text-[9px] uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md">
          Most Popular Cluster
        </div>
      )}

      <div className="space-y-4 text-left">
        <div className="space-y-1">
          <h4 className="text-lg font-bold font-heading text-white tracking-tight flex items-center gap-2">
            {name === 'Growth' ? (
              <Sparkles size={16} className="text-amber-400" />
            ) : (
              <Zap size={16} style={{ color: accentColor }} />
            )}
            {name} Tier
          </h4>
          <p className="text-xs font-mono text-[#ccc3d8] opacity-70">
            Strategic Agent Forge Environment
          </p>
        </div>

        {/* Pricing Display */}
        <div className="flex items-baseline gap-2 py-2 border-b border-white/[0.04]">
          <span className="text-3xl font-bold text-white font-heading">
            {selectedGateway === 'stripe' ? `$${usdPrice}` : `₹${priceRs}`}
          </span>
          <span className="text-xs font-mono text-[#ccc3d8]">
            {selectedGateway === 'stripe' ? 'USD / mo (equiv.)' : '/ monthly recurring'}
          </span>
        </div>

        {/* Token Allocation Specs */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#0a0e18]/40 border border-[#1f2937] rounded-xl font-mono text-[10px]">
          <div>
            <span className="text-zinc-500 block uppercase font-bold">Setup Pool</span>
            <span className="text-white font-semibold block mt-0.5">{creationTokens} Credits</span>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase font-bold">Live Stream Cap</span>
            <span className="text-[#4cd7f6] font-semibold block mt-0.5 truncate">{chatTokensText}</span>
          </div>
        </div>

        {/* Core Feature Matrix */}
        <ul className="space-y-2.5 pt-2">
          {features.map((feat, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-[#dfe2f1]">
              <CheckCircle2 size={14} className="text-[#4cd7f6] mt-0.5 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gateway Selector and Check-out Action Triggers */}
      <div className="space-y-3 pt-6 mt-auto">
        {/* Gateway Selector Grid (Hidden when plan is already active) */}
        {!isCurrentPlan && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0e18] rounded-xl border border-[#1f2937] font-mono text-[10px]">
            <button
              type="button"
              disabled={isPaymentLoading}
              onClick={() => setSelectedGateway('razorpay')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                selectedGateway === 'razorpay'
                  ? 'bg-[#1f2937] text-white border border-zinc-700 font-semibold shadow-sm'
                  : 'text-[#ccc3d8] opacity-60 hover:opacity-90'
              }`}
            >
              <span>💳</span> UPI / Cards (IN)
            </button>
            <button
              type="button"
              disabled={isPaymentLoading}
              onClick={() => setSelectedGateway('stripe')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                selectedGateway === 'stripe'
                  ? 'bg-[#1f2937] text-white border border-zinc-700 font-semibold shadow-sm'
                  : 'text-[#ccc3d8] opacity-60 hover:opacity-90'
              }`}
            >
              <Globe size={11} className="text-[#4cd7f6]" /> Stripe Intl
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          disabled={isPaymentLoading || isCurrentPlan}
          onClick={() => processSubscriptionCheckout(name, selectedGateway)}
          className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
            isCurrentPlan 
              ? 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed shadow-none font-mono' 
              : 'btn-primary cursor-pointer shadow-purple-500/5 hover:scale-[1.01]'
          }`}
          style={{ 
            backgroundColor: !isCurrentPlan && name === 'Growth' ? '#7c3aed' : undefined, 
            border: !isCurrentPlan && name !== 'Growth' ? '1px solid #374151' : undefined 
          }}
        >
          {isCurrentPlanProcessing ? (
            <div className="border-2 border-white/30 border-t-white rounded-full animate-spin h-3.5 w-3.5" />
          ) : isCurrentPlan ? (
            <span>✨ System Active</span>
          ) : (
            <>
              <CreditCard size={14} /> Commit Subscription
            </>
          )}
        </button>
      </div>
    </div>
  );
};