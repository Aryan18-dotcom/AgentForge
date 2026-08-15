// src/hooks/usePayment.ts
import { useContext } from 'react';
import { paymentApi } from '../services/paymentApi';
import { toast } from 'react-hot-toast';
import { PaymentContext } from '../PaymentContext';

// Extend global window type to safely compile dynamic Razorpay script payloads inside React hooks
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment hook must operate internally inside a PaymentProvider wrapper.');

  const {
    status,
    setStatus,
    activeProcessingPlan,
    setActiveProcessingPlan,
    paymentError,
    setPaymentError,
  } = context;

  /**
   * Helper utility: Asynchronously lazy-loads Razorpay script tags inside browser DOM nodes
   */
  const loadRazorpayScriptScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processSubscriptionCheckout = async (
    planName: 'Starter' | 'Growth' | 'Experience',
    gateway: 'stripe' | 'razorpay'
  ) => {
    setStatus('PROCESSING');
    setActiveProcessingPlan(planName);
    setPaymentError(null);

    try {
      const session = await paymentApi.createCheckoutIntent(planName, gateway);

      // ==========================================
      // 💳 PIPELINE BRANCH A: STRIPE GATEWAY REDIRECT
      // ==========================================
      if (gateway === 'stripe' && session.url) {
        toast.loading('Redirecting to secure Stripe billing gateway...');
        window.location.href = session.url; // Escapes client application layout context safely
        return;
      }

      // ==========================================
      // 💳 PIPELINE BRANCH B: RAZORPAY NATIVE INJECTION
      // ==========================================
      if (gateway === 'razorpay' && session.razorpayOrderId) {
        const isScriptLoaded = await loadRazorpayScriptScript();
        if (!isScriptLoaded) {
          throw new Error('Razorpay SDK failed to bind to the client frame window.');
        }

        const options = {
          key: session.keyId,
          amount: session.amount,
          currency: session.currency || 'INR',
          name: 'AgentForge Matrix Systems',
          description: `Upgrading Cluster Instance to ${planName} Plan`,
          order_id: session.razorpayOrderId,
          handler: async function (response: any) {
            setStatus('PROCESSING');
            try {
              const validationResult = await paymentApi.verifyRazorpaySignature({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName,
              });

              if (validationResult.success) {
                setStatus('SUCCESS');
                toast.success(`Subscription securely provisioned to: ${planName}!`);
                // Optional window reload to trigger user context update
                setTimeout(() => window.location.reload(), 1500);
              } else {
                throw new Error('Signature validation verification failed.');
              }
            } catch (err: any) {
              setStatus('FAILED');
              setPaymentError(err.message);
              toast.error('Cryptographic signature verification broken down.');
            }
          },
          theme: { color: '#7c3aed' }, // Matches your primary branding tokens base hex colors
          modal: {
            ondismiss: function () {
              setStatus('IDLE');
              setActiveProcessingPlan(null);
              toast.dismiss();
            },
          },
        };

        const razorpayUiWindow = new window.Razorpay(options);
        razorpayUiWindow.open();
      }
    } catch (error: any) {
      console.error('[Payment Process Loop System Exception]:', error);
      setStatus('FAILED');
      const fallbackErrorMessage = error.response?.data?.message || error.message || 'Transaction broken down.';
      setPaymentError(fallbackErrorMessage);
      toast.error(fallbackErrorMessage);
    }
  };

  /**
   * Verifies Stripe session ID when redirected back to application
   */
  const verifyStripeSession = async (sessionId: string) => {
    setStatus('PROCESSING');
    setPaymentError(null);
    const toastId = toast.loading('Verifying Stripe payment settlement...');

    try {
      const result = await paymentApi.verifyStripePayment({ sessionId });
      if (result.success) {
        setStatus('SUCCESS');
        toast.success(result.message || 'Payment verified! Account updated.', { id: toastId });
        return true;
      } else {
        throw new Error(result.message || 'Stripe payment verification failed.');
      }
    } catch (err: any) {
      setStatus('FAILED');
      setPaymentError(err.message);
      toast.error(err.message || 'Payment settlement failed.', { id: toastId });
      return false;
    }
  };

  return {
    processSubscriptionCheckout,
    verifyStripeSession,
    isPaymentLoading: status === 'PROCESSING',
    paymentStatus: status,
    activeProcessingPlan,
    paymentError,
  };
};