const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

export interface CheckoutSessionResponse {
  success: boolean;
  url?: string;             // Stripe redirect URL
  razorpayOrderId?: string; // Razorpay Order ID
  amount?: number;
  currency?: string;
  keyId?: string;           // Razorpay Public Client Key
}

export const paymentApi = {
  /**
   * Dispatches an upstream transaction intent request
   */
  createCheckoutIntent: async (
    planName: 'Starter' | 'Growth' | 'Experience',
    gateway: 'stripe' | 'razorpay'
  ): Promise<CheckoutSessionResponse> => {
    const response = await fetch(`${BASE_URL}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planName, gateway }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Verifies signatures returned after a Razorpay transaction completes
   */
  verifyRazorpaySignature: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planName: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${BASE_URL}/payments/verify-razorpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Verifies Stripe payment session ID after redirect return
   */
  verifyStripePayment: async (payload: {
    sessionId: string;
    planName?: string;
  }): Promise<{ success: boolean; message: string; user?: any; credits?: number }> => {
    const response = await fetch(`${BASE_URL}/payments/verify-stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};