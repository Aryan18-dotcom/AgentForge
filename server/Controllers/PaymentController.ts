// server/Controllers/PaymentController.ts
import { Request, Response } from "express";
import crypto from "crypto";
import { Stripe } from "stripe";
import Razorpay from "razorpay";
import UserDB from "../Models/UserModel.js";
import PaymentDB from "../Models/PaymentModels.js";
import mongoose from "mongoose";

// Initialize external payment ecosystem instances
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-07-29.dahlia" as any });
const FrontEndURL = process.env.VITE_FRONT_END_URL || "http://localhost:5173";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

/**
 * UTILITY PRICING MATRICES: Encapsulates configurations for Subscriptions and Top-Up Packs
 */
const PLAN_PRICING_MATRIX = {
    Starter: { priceINR: 199, creationTokens: 100, chatTokens: 200000 },
    Growth: { priceINR: 599, creationTokens: 500, chatTokens: 1000000 },
    Experience: { priceINR: 1499, creationTokens: 1000, chatTokens: 5000000 }
};

const TOPUP_PRICING_MATRIX = {
    M_TOKENS_5:  { priceINR: 99,  chatTokens: 500000 },   // 500K tokens for ₹99
    M_TOKENS_20: { priceINR: 299, chatTokens: 2500000 }  // 2.5M tokens for ₹299
};

// =========================================================================
// 💳 PHASE 1: DISPATCH UPSTREAM MONTHLY SUBSCRIPTION INTENTS
// =========================================================================
export const CreateCheckoutSession = async (req: Request, res: Response) => {
    try {
        const userId = req.session?.userId || (req as any).user?._id; 
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized session connection rejected." });
        }

        const { planName, gateway } = req.body;
        if (!planName || !['Starter', 'Growth', 'Experience'].includes(planName)) {
            return res.status(400).json({ success: false, message: "Invalid plan allocation target parameter." });
        }

        const targetPlan = PLAN_PRICING_MATRIX[planName as keyof typeof PLAN_PRICING_MATRIX];

        // ─────────────────────────────────────────────────────────────────
        // BRANCH A: STRIPE RECURRING SUBSCRIPTION PIPELINE
        // ─────────────────────────────────────────────────────────────────
        if (gateway === 'stripe') {
            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price_data: {
                        currency: "inr",
                        product_data: { 
                            name: `AgentForge Matrix ${planName} Plan Deployment`,
                            description: `Includes ${targetPlan.creationTokens} Setup Credits & ${targetPlan.chatTokens.toLocaleString()} Chat Execution Tokens.`
                        },
                        unit_amount: targetPlan.priceINR * 100,
                    },
                    quantity: 1,
                }],
                mode: "payment",
                success_url: `${FrontEndURL}/subscription?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${FrontEndURL}/subscription`,
                metadata: {
                    userId: userId.toString(),
                    planName,
                    creationTokens: targetPlan.creationTokens.toString(),
                    chatTokens: targetPlan.chatTokens.toString()
                }
            });

            return res.status(200).json({ success: true, url: stripeSession.url });
        }

        // ─────────────────────────────────────────────────────────────────
        // BRANCH B: RAZORPAY NATIVE SUBSCRIPTION PIPELINE
        // ─────────────────────────────────────────────────────────────────
        if (gateway === 'razorpay') {
            const razorpayOptions = {
                amount: targetPlan.priceINR * 100,
                currency: "INR",
                receipt: `rcpt_forge_${crypto.randomBytes(6).toString('hex')}`,
                notes: {
                    userId: userId.toString(),
                    planName
                }
            };

            const rzpOrder = await razorpay.orders.create(razorpayOptions);

            await PaymentDB.create({
                userId,
                subscriptionTier: planName,
                paymentMode: 'Razorpay',
                gatewayTransactionId: rzpOrder.id,
                amount: targetPlan.priceINR,
                status: 'PENDING',
                validityExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            return res.status(200).json({
                success: true,
                razorpayOrderId: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        }

        return res.status(400).json({ success: false, message: "Target monetization channel gateway unrecognized." });

    } catch (error: any) {
        console.error("[AgentForge Billing Channel Intent Failure]:", error);
        return res.status(500).json({ success: false, message: "Internal checkout initialization infrastructure breakdown.", error: error.message });
    }
};

// =========================================================================
// 🪙 PHASE 2: DISPATCH UPSTREAM ONE-TIME TOKEN TOP-UP INTENTS
// =========================================================================
export const CreateTokenTopUpSession = async (req: Request, res: Response) => {
    try {
        const userId = req.session?.userId || (req as any).user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized token operation rejected." });
        }

        const { topUpPackId, gateway } = req.body;

        if (!topUpPackId || !TOPUP_PRICING_MATRIX[topUpPackId as keyof typeof TOPUP_PRICING_MATRIX]) {
            return res.status(400).json({ success: false, message: "Invalid token pack identifier specified." });
        }

        const selectedPack = TOPUP_PRICING_MATRIX[topUpPackId as keyof typeof TOPUP_PRICING_MATRIX];

        // ─────────────────────────────────────────────────────────────────
        // BRANCH A: STRIPE ONE-TIME VALUE TOP-UP PIPELINE
        // ─────────────────────────────────────────────────────────────────
        if (gateway === 'stripe') {
            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price_data: {
                        currency: "inr",
                        product_data: { 
                            name: `AgentForge ${selectedPack.chatTokens.toLocaleString()} Chat Token Top-Up Pack`,
                            description: `One-time balance injection of ${selectedPack.chatTokens.toLocaleString()} execution tokens directly into your workspace fleet wallet.`
                        },
                        unit_amount: selectedPack.priceINR * 100,
                    },
                    quantity: 1,
                }],
                mode: "payment",
                success_url: `${FrontEndURL}/subscription?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${FrontEndURL}/subscription`,
                metadata: {
                    userId: userId.toString(),
                    planName: "Token_TopUp", // Explicit identifier caught inside your Stripe Webhook
                    chatTokensToGrant: selectedPack.chatTokens.toString()
                }
            });

            return res.status(200).json({ success: true, url: stripeSession.url });
        }

        // ─────────────────────────────────────────────────────────────────
        // BRANCH B: RAZORPAY NATIVE VALUE TOP-UP PIPELINE
        // ─────────────────────────────────────────────────────────────────
        if (gateway === 'razorpay') {
            const rzpOrder = await razorpay.orders.create({
                amount: selectedPack.priceINR * 100,
                currency: "INR",
                receipt: `rcpt_topup_${crypto.randomBytes(6).toString('hex')}`,
                notes: {
                    userId: userId.toString(),
                    planName: "Token_TopUp", // Explicit identifier caught inside Razorpay Signature Verification
                    chatTokensToGrant: selectedPack.chatTokens.toString()
                }
            });

            await PaymentDB.create({
                userId,
                subscriptionTier: "Token_TopUp",
                paymentMode: 'Razorpay',
                gatewayTransactionId: rzpOrder.id,
                amount: selectedPack.priceINR,
                status: 'PENDING',
                validityExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Top-ups are valid for 1 solid year
            });

            return res.status(200).json({
                success: true,
                razorpayOrderId: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        }

        return res.status(400).json({ success: false, message: "Target token recharger channel unrecognized." });

    } catch (error: any) {
         console.error("[AgentForge Token TopUp Intent Failure]:", error);
         return res.status(500).json({ success: false, message: "Internal top-up initialization failure.", error: error.message });
    }
};

// =========================================================================
// 🛡️ PHASE 3: RAZORPAY DIRECT SIGNATURE VERIFICATION HANDLER
// =========================================================================
export const VerifyRazorpayPaymentSignature = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Incomplete payment signatures tokens received." });
        }

        // Cryptographically verify payload authenticity
        const textPayloadBody = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignatureHash = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(textPayloadBody.toString())
            .digest("hex");

        if (expectedSignatureHash !== razorpay_signature) {
            await PaymentDB.findOneAndUpdate(
                { gatewayTransactionId: razorpay_order_id },
                { $set: { status: 'FAILED' } }
            );
            return res.status(400).json({ success: false, message: "Cryptographic payment verification tampering caught. Request rejected." });
        }

        const activePaymentReceipt = await PaymentDB.findOne({ gatewayTransactionId: razorpay_order_id });
        if (!activePaymentReceipt) {
            return res.status(404).json({ success: false, message: "Transaction tracking identifier missing from core ledger." });
        }

        // 🌟 CONDITIONAL BALANCE ALLOCATION LOOP
        if (planName === "Token_TopUp" || activePaymentReceipt.subscriptionTier === "Token_TopUp") {
            // Find the targeted pack value configurations dynamically
            const matchingPack = Object.values(TOPUP_PRICING_MATRIX).find(p => p.priceINR === activePaymentReceipt.amount);
            const tokensToGrant = matchingPack ? matchingPack.chatTokens : 500000;

            // Increment conversational wallet completely independent of their recurring subscription strings
            await UserDB.findByIdAndUpdate(activePaymentReceipt.userId, {
                $inc: { chatExecutionToken: tokensToGrant }
            });
        } else {
            // Re-fetch calculations rules from the core subscription plan matrix
            const targetPlan = PLAN_PRICING_MATRIX[planName as keyof typeof PLAN_PRICING_MATRIX];

            await UserDB.findByIdAndUpdate(activePaymentReceipt.userId, {
                $set: { SubscriptionPlan: planName },
                $inc: { 
                    agentCreationToken: targetPlan.creationTokens,
                    chatExecutionToken: targetPlan.chatTokens
                }
            });
        }

        // Finalize auditing invoice records
        activePaymentReceipt.status = 'SUCCESS';
        activePaymentReceipt.gatewayTransactionId = razorpay_payment_id; 
        await activePaymentReceipt.save();

        return res.status(200).json({ success: true, message: "Wallet tokens provisioned successfully." });

    } catch (error: any) {
        console.error("[Razorpay Cryptographic Signature Validation Exception]:", error);
        return res.status(500).json({ success: false, message: "Signature verification infrastructure error loops.", error: error.message });
    }
};

export const verifyStripePayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sessionId, paymentIntentId, planName: clientPlanName } = req.body;
    console.log(`[Stripe Verification Request]: sessionId=${sessionId}, paymentIntentId=${paymentIntentId}, clientPlanName=${clientPlanName}`);

    // Support authenticated user from session or request body/auth
    const reqUserId = req.session?.userId || (req as any).user?._id || (req as any).user?.id || req.body.userId;
    const identifier = sessionId || paymentIntentId;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "A valid Stripe Session ID or Payment Intent ID is required.",
      });
    }

    let isPaid = false;
    let targetUserId = reqUserId;
    let paymentId = "";
    let amountTotal = 0;
    let rawPlanName = "";
    let creationTokensToGrant = 0;
    let chatTokensToGrant = 0;

    // ─────────────────────────────────────────────────────────────────
    // Case 1: Stripe Checkout Session (sessionId starts with "cs_")
    // ─────────────────────────────────────────────────────────────────
    if (identifier.startsWith("cs_")) {
      const session = await stripe.checkout.sessions.retrieve(identifier);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Stripe Checkout session not found.",
        });
      }

      isPaid = session.payment_status === "paid";
      paymentId = session.id;
      amountTotal = (session.amount_total || 0) / 100;

      targetUserId = session.metadata?.userId || session.client_reference_id || reqUserId;
      rawPlanName = session.metadata?.planName || clientPlanName;

      if (rawPlanName === "Token_TopUp") {
        chatTokensToGrant = parseInt(session.metadata?.chatTokensToGrant || "0");
      } else if (rawPlanName && PLAN_PRICING_MATRIX[rawPlanName as keyof typeof PLAN_PRICING_MATRIX]) {
        const matrixPlan = PLAN_PRICING_MATRIX[rawPlanName as keyof typeof PLAN_PRICING_MATRIX];
        creationTokensToGrant = parseInt(session.metadata?.creationTokens || matrixPlan.creationTokens.toString());
        chatTokensToGrant = parseInt(session.metadata?.chatTokens || matrixPlan.chatTokens.toString());
      }
    } 
    // ─────────────────────────────────────────────────────────────────
    // Case 2: Stripe PaymentIntent (identifier starts with "pi_")
    // ─────────────────────────────────────────────────────────────────
    else if (identifier.startsWith("pi_")) {
      const paymentIntent = await stripe.paymentIntents.retrieve(identifier);

      if (!paymentIntent) {
        return res.status(404).json({
          success: false,
          message: "Stripe Payment Intent not found.",
        });
      }

      isPaid = paymentIntent.status === "succeeded";
      paymentId = paymentIntent.id;
      amountTotal = (paymentIntent.amount || 0) / 100;

      targetUserId = paymentIntent.metadata?.userId || reqUserId;
      rawPlanName = paymentIntent.metadata?.planName || clientPlanName;

      if (rawPlanName === "Token_TopUp") {
        chatTokensToGrant = parseInt(paymentIntent.metadata?.chatTokensToGrant || "0");
      } else if (rawPlanName && PLAN_PRICING_MATRIX[rawPlanName as keyof typeof PLAN_PRICING_MATRIX]) {
        const matrixPlan = PLAN_PRICING_MATRIX[rawPlanName as keyof typeof PLAN_PRICING_MATRIX];
        creationTokensToGrant = parseInt(paymentIntent.metadata?.creationTokens || matrixPlan.creationTokens.toString());
        chatTokensToGrant = parseInt(paymentIntent.metadata?.chatTokens || matrixPlan.chatTokens.toString());
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe identifier format provided.",
      });
    }

    // Verify payment completion
    if (!isPaid) {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed or verified.",
      });
    }

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Unable to identify the user for credit allocation.",
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Idempotency Guard via PaymentDB
    // ─────────────────────────────────────────────────────────────────
    const existingPayment = await PaymentDB.findOne({ gatewayTransactionId: paymentId });
    if (existingPayment && existingPayment.status === 'SUCCESS') {
      const currentUser = await UserDB.findById(targetUserId);
      return res.status(200).json({
        success: true,
        message: "Payment already verified and credits applied.",
        user: currentUser,
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Strict Enum Normalization: ['Free', 'Starter', 'Growth', 'Experience']
    // ─────────────────────────────────────────────────────────────────
    let mappedTier: 'Free' | 'Starter' | 'Growth' | 'Experience' = 'Starter';
    if (rawPlanName === 'Experience' || rawPlanName === 'Experience') {
      mappedTier = 'Experience';
    } else if (rawPlanName === 'Growth') {
      mappedTier = 'Growth';
    } else if (rawPlanName === 'Starter') {
      mappedTier = 'Starter';
    } else if (rawPlanName === 'Free') {
      mappedTier = 'Free';
    }

    // ─────────────────────────────────────────────────────────────────
    // Apply Tokens & Plan Updates to UserDB
    // ─────────────────────────────────────────────────────────────────
    let updatedUser;

    if (rawPlanName === "Token_TopUp") {
      updatedUser = await UserDB.findByIdAndUpdate(
        targetUserId,
        {
          $inc: { chatExecutionToken: chatTokensToGrant }
        },
        { returnDocument: 'after' }
      );

      await PaymentDB.create({
        userId: new mongoose.Types.ObjectId(targetUserId),
        subscriptionTier: 'Experience', // Fallback to schema tier for top-ups
        paymentMode: 'Stripe Credit Network',
        gatewayTransactionId: paymentId,
        amount: amountTotal,
        status: 'SUCCESS',
        validityExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });
    } else {
      updatedUser = await UserDB.findByIdAndUpdate(
        targetUserId,
        {
          $set: { SubscriptionPlan: mappedTier },
          $inc: { 
            agentCreationToken: creationTokensToGrant,
            chatExecutionToken: chatTokensToGrant 
          }
        },
        { returnDocument: 'after' }
      );

      await PaymentDB.create({
        userId: new mongoose.Types.ObjectId(targetUserId),
        subscriptionTier: mappedTier,
        paymentMode: 'Stripe Credit Network',
        gatewayTransactionId: paymentId,
        amount: amountTotal,
        status: 'SUCCESS',
        validityExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found in database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stripe payment verified and workspace tokens provisioned successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("[Stripe Verification Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error verifying Stripe payment.",
    });
  }
};

// =========================================================================
// 🛡️ PHASE 4: STRIPE ASYNCHRONOUS BACKGROUND WEBHOOK RESOLVER
// =========================================================================
export const HandleStripeWebhookEvent = async (req: Request, res: Response) => {
    const rawStripeSignatureHeader = req.headers["stripe-signature"]!;
    let verifiedEvent;

    try {
        verifiedEvent = stripe.webhooks.constructEvent(
            (req as any).rawBody || req.body,
            rawStripeSignatureHeader,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`[Stripe Webhook Signature Verification Crash]: ${err.message}`);
        return res.status(400).send(`Webhook Signature Authentication Failure: ${err.message}`);
    }

    if (verifiedEvent.type === "checkout.session.completed") {
        const completedSession = verifiedEvent.data.object as any;
        const { userId, planName, creationTokens, chatTokens, chatTokensToGrant } = completedSession.metadata;

        // 🌟 CONDITIONAL BALANCE ALLOCATION LOOP
        if (planName === "Token_TopUp") {
            const totalTopupTokens = parseInt(chatTokensToGrant);

            await UserDB.findByIdAndUpdate(userId, {
                $inc: { chatExecutionToken: totalTopupTokens }
            });

            await PaymentDB.create({
                userId: new mongoose.Types.ObjectId(userId),
                subscriptionTier: "Token_TopUp",
                paymentMode: 'Stripe Credit Network',
                gatewayTransactionId: completedSession.id,
                amount: completedSession.amount_total / 100,
                status: 'SUCCESS',
                validityExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
        } else {
            await UserDB.findByIdAndUpdate(userId, {
                $set: { SubscriptionPlan: planName },
                $inc: { 
                    agentCreationToken: parseInt(creationTokens),
                    chatExecutionToken: parseInt(chatTokens)
                }
            });

            await PaymentDB.create({
                userId: new mongoose.Types.ObjectId(userId),
                subscriptionTier: planName,
                paymentMode: 'Stripe Credit Network',
                gatewayTransactionId: completedSession.id,
                amount: completedSession.amount_total / 100,
                status: 'SUCCESS',
                validityExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }
    }

    return res.status(200).json({ received: true });
};