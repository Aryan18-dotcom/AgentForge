import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Award, Loader2 } from 'lucide-react';
import { PaymentProvider } from '../PaymentContext';
import { usePayment } from '../hooks/usePayment';
import { fadeInUp, staggerContainer } from '../../../components/animation/motionVariants';
import { SubscriptionCard } from '../../../components/subscriptionPage-components/SubscriptionCards';
import { useAuth } from '../../auth/hooks/useAuth';

function SubscriptionModelContent() {
  const { user, loading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('Free');
  const { verifyStripeSession } = usePayment();
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (user?.SubscriptionPlan) {
      setCurrentPlan(user.SubscriptionPlan);
    } else {
      setCurrentPlan('Free');
    }
  }, [user]);

  // 🌟 VERIFY STRIPE PAYMENT ON REDIRECT RETURN
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId && !verifiedRef.current) {
      verifiedRef.current = true;

      verifyStripeSession(sessionId).then(async (success) => {
        // Clean the ?session_id query parameter from the URL bar
        window.history.replaceState({}, document.title, window.location.pathname);

        if (success) {
          window.location.reload();
        }
      });
    }
  }, [verifyStripeSession]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-2 font-mono text-xs text-zinc-400">
        <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
        <span>Syncing Node Environment Credentials...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full h-full pb-12 select-none space-y-8"
    >
      <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-3 py-1 rounded-full text-xs text-[#d2bbff] font-mono tracking-wider uppercase">
          <Award size={12} className="animate-pulse" /> AgentForge Capital Pipelines
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl">
          Choose Your Operational Scale
        </h1>
        <p className="text-sm text-[#ccc3d8] leading-relaxed">
          Upgrade your baseline cluster to provision multiple live custom bots, unlock dynamic vector contextual identities, and open persistent external message routing channels.
        </p>
      </motion.div>

      {currentPlan === 'Free' && (
        <motion.div
          variants={fadeInUp}
          className="max-w-4xl mx-auto bg-amber-400/5 border border-amber-400/20 rounded-2xl p-4 text-left flex items-start gap-3"
        >
          <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-zinc-300">
            <span className="font-bold text-amber-400 font-mono">Sandbox Level Active:</span> Your newly created operator account currently contains complimentary testing balances (<strong>20 setup credits</strong>). You can compile internal workspace prototypes freely; however, connecting active chat widget windows to your external business endpoints requires a premium deployment level.
          </div>
        </motion.div>
      )}

      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        <SubscriptionCard
          name="Starter"
          priceRs={199}
          creationTokens={100}
          chatTokensText="200,000 Tokens"
          accentColor="#4cd7f6"
          isCurrentPlan={currentPlan === 'Starter'}
          features={[
            "Deploy up to 10 Active Agents Matrix",
            "Standard Backbone Logic Node Arrays",
            "200,000 Live Monthly Chat Tokens Included",
            "Basic Static Instruction Context Document Feeds",
            "24-Hour Pipeline Health Monitoring Diagnostics"
          ]}
        />

        <SubscriptionCard
          name="Growth"
          priceRs={599}
          creationTokens={500}
          chatTokensText="1,000,000 Tokens"
          accentColor="#7c3aed"
          isCurrentPlan={currentPlan === 'Growth'}
          features={[
            "Deploy up to 50 Custom Workspace Agents",
            "Next-Gen gemini-2.5-flash High Velocity Engines",
            "1 Million Live Monthly Conversational Tokens Pool",
            "🌟 Dynamic Vector Identity Context Synced Memory",
            "Full Bento Box UI Radii & Animations Design Suites",
            "Priority Support Ticket Despatch Escalation Nodes"
          ]}
        />

        <SubscriptionCard
          name="Experience"
          priceRs={1499}
          creationTokens={1000}
          chatTokensText="5,000,000 Tokens"
          accentColor="#f59e0b"
          isCurrentPlan={currentPlan === 'Experience'}
          features={[
            "Provision Unlimited Custom Workflow Agents",
            "Dedicated Isolated Vector Shard Storage Allocations",
            "Uncapped Message Volumes Telemetry Metering Tracks",
            "Custom RAG Endpoint Payload Hook Adjustments",
            "Dedicated Human Technical Account Manager Assigns",
            "Guaranteed 99.99% Operational Runtime SLA Handshaking"
          ]}
        />
      </motion.div>
    </motion.div>
  );
}

export default function SubscriptionModelPage() {
  return (
    <PaymentProvider>
      <SubscriptionModelContent />
    </PaymentProvider>
  );
}