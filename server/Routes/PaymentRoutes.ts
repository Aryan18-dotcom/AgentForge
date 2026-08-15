import express from 'express';
import { 
    CreateCheckoutSession, 
    VerifyRazorpayPaymentSignature, 
    HandleStripeWebhookEvent, 
    CreateTokenTopUpSession,
    verifyStripePayment
} from '../Controllers/PaymentController.js';
import isAuthenticated from '../Middlewares/Auth.js';

const paymentRouter = express.Router();

// 💳 Endpoint A: Handles multi-gateway session generation intents (Stripe Checkout & Razorpay Order API)
paymentRouter.post('/create-checkout-session', isAuthenticated, CreateCheckoutSession);

// 🛡️ Endpoint B: Verifies localized, domestic client signatures pushed by the Razorpay Iframe Modal window
paymentRouter.post('/verify-razorpay', isAuthenticated, VerifyRazorpayPaymentSignature);
paymentRouter.post('/verify-stripe', isAuthenticated, verifyStripePayment);

// 🛡️ Endpoint C: Receives background, direct webhooks events pushed securely from Stripe Infrastructure
paymentRouter.post('/webhook', isAuthenticated, HandleStripeWebhookEvent);

// 💳 Endpoint D: Handles multi-gateway session generation intents for token top-ups (Stripe Checkout & Razorpay Order API)
paymentRouter.post('/create-topup-session', isAuthenticated, CreateTokenTopUpSession);

export default paymentRouter;