import { Request, Response } from "express";
import mongoose from "mongoose";
import { AgentDB, TokenLedgerDB } from "../Models/AgentModels.js";
import UserDB from "../Models/UserModel.js";
import { ChatSessionDB, MessageDB } from "../Models/ChatSession.js";

import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk"; // 🌟 NEW: Initialize secondary fallback gateway provider
import { sendInformationEmailToSupport } from "../Configs/HelperFunctions.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // 🌟 NEW: Instantiate back up client

export const HandleExternalAgentChat = async (req: Request, res: Response) => {
    let sessionObjectId: mongoose.Types.ObjectId | null = null;
    let totalTokensSpent = 0;
    let resolvedGeminiModel = "gemini-2.5-flash";
    let agent: any = null; // declared here so catch/failover blocks can reference it

    try {
        const { agentId } = req.params;
        const { sessionId, message, clientUserIdentity } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Empty token execution frame parameter rejected." });
        }

        // 1. RECOVER WIDGET MODEL CONFIGURATION AND CHECK ACTIVITY TIER
        agent = await AgentDB.findById(agentId);
        if (!agent || !agent.isActive || agent.status !== 'active') {
            return res.status(404).json({ message: "Target agent cluster dropped, suspended, or inactive." });
        }

        // 2. VERIFY SAAS PLATFORM CREATOR STATUS
        const agentCreator = await UserDB.findById(agent.userId);
        if (!agentCreator || agentCreator.isSuspended) {
            return res.status(403).json({ message: "Asset hosting channel suspended." });
        }

        // 3. SUBSCRIPTION TIERS LOCK GATEWAY: BLOCKS RECOGNIZED 'FREE' PLANS FROM CHAT ANSWERS
        if (agentCreator.SubscriptionPlan === 'Free') {
            return res.status(402).json({
                success: false,
                message: `[Subscription Required]: ${agent.agentName} was generated successfully using your free credits. However, live conversation features are restricted on Free plans. Please upgrade to a premium plan (e.g., Growth Tier) within your dashboard to activate widget messaging functionality on external websites.`
            });
        }

        // 4. OPERATIONAL WALLET BALANCE VALIDATION
        // 🌟 FIXED: Changed from plural chatExecutionTokens to your real singular schema field chatExecutionToken
        if (agentCreator.chatExecutionToken !== undefined && agentCreator.chatExecutionToken <= 0) {
            sendInformationEmailToSupport(
                agentCreator.email,
                `Token Exhaustion Alert: ${agent.agentName} Offline`,
                {
                    username: agentCreator.username,
                    accountEmail: agentCreator.email,
                    agentName: agent.agentName,
                    currentTokenBalance: agentCreator.chatExecutionToken
                }
            );
            await AgentDB.findByIdAndUpdate(agent._id, { isActive: false, status: 'paused' });
            return res.status(402).json({
                success: false,
                code: "CONVERSATIONAL_TOKEN_EXHAUSTION",
                message: "[AgentForge] Server Error, Cant process the request."
            });
        }

        // 5. TIER-BOUND RATE LIMITATION CEILING SYSTEM VALIDATIONS
        const tier = agentCreator.SubscriptionPlan || 'Free';
        const hourlyWindowLimit = getTierRateLimitThreshold(tier);
        const currentHourStart = new Date(Date.now() - 60 * 60 * 1000);
        const activeUsageVolume = await TokenLedgerDB.countDocuments({
            agentId: agent._id,
            timestamp: { $gte: currentHourStart }
        });

        if (activeUsageVolume >= hourlyWindowLimit) {
            return res.status(429).json({ message: "Hourly telemetry limits exhausted for this deployment level." });
        }

        // 6. RESOLVE INTERACTIVE CHAT SESSION POINTERS
        let activeSession = null;

        if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
            sessionObjectId = new mongoose.Types.ObjectId(sessionId);
            activeSession = await ChatSessionDB.findOne({ _id: sessionObjectId, agentId: agent._id });
        }

        if (!activeSession) {
            const sessionTitle = (agent.vectorMemoryEnabled && clientUserIdentity?.customerName)
                ? `Session for Authenticated Operator: ${clientUserIdentity.customerName}`
                : `External Anonymized FAQ Widget Track`;

            activeSession = await ChatSessionDB.create({ agentId: agent._id, userId: agent.userId, sessionTitle });
        }
        sessionObjectId = activeSession._id as mongoose.Types.ObjectId;

        // Cache the incoming message string to MongoDB tracking history lines
        await MessageDB.create({ sessionId: sessionObjectId, sender: 'USER', content: message.trim() });

        // Retrieve historical arrays for conversational context depth
        const historicalMessages = await MessageDB.find({ sessionId: sessionObjectId }).sort({ timestamp: 1 }).limit(30);

        // 7. DETERMINE TONAL PERSONA VALUES
        let behavioralToneRules = "";

        switch (agent.backboneModel) {
            case 'Professional (Analytical, Corporate, Direct)':
                resolvedGeminiModel = "gemini-2.5-flash";
                behavioralToneRules = "Maintain a formal corporate tone. Be direct, factual, and analytical.";
                break;
            case 'Friendly (Approachable, Empathetic, Engaging)':
                resolvedGeminiModel = "gemini-2.5-flash";
                behavioralToneRules = "Be warm, approachable, deeply empathetic, and conversational.";
                break;
            case 'Creative (Brainstorming, Bold, Conversational)':
                resolvedGeminiModel = "gemini-2.5-flash";
                behavioralToneRules = "Adopt an expressive, out-of-the-box stance. Be bold, conversational, and highly creative.";
                break;
            case 'Technical Support (Code-Fluent, Diagnostic, Precise)':
                resolvedGeminiModel = "gemini-2.5-flash";
                behavioralToneRules = "Prioritize precise diagnosis, clear syntax rules, and code-fluent diagnostic configurations.";
                break;
        }

        // 8. MAP CONTEXT VECTOR RULES ACCORDING TO USER IDEATION
        let structuralSystemInstruction = `${behavioralToneRules}\n\n${agent.systemDirective}`;

        if (agent.vectorMemoryEnabled) {
            if (clientUserIdentity && Object.keys(clientUserIdentity).length > 0) {
                const identityContextBlob = JSON.stringify(clientUserIdentity);
                structuralSystemInstruction += `\n\n[CRITICAL RUNTIME RECONCILED CONTEXT]: The visitor interacting on the host website has been authenticated with these metadata parameters: ${identityContextBlob}. Custom-tailor your answers utilizing this customer parameters schema context natively (e.g. tracking recentOrderNumber status metrics, greeting them by customerName, referencing their lastPurchasedAsset info details).`;
            } else {
                structuralSystemInstruction += `\n\n[NOTICE]: Context identity synchronization tracking is active but no real-time metadata session parameters were generated from the client viewport stream yet. Answer questions professionally using session thread logs history.`;
            }
        } else {
            structuralSystemInstruction += `\n\n[RESTRICTION]: User Identity Context Sync is disabled for this bot instance. Do NOT request or attempt to process live customer account/cart database parameters. Rely completely on the static instructions provided above.`;
        }

        // 9. PREPARE STRUCTURAL CHAT CONVERSATION ARRAYS FOR GEMINI
        const chatContentsHistory: any[] = [];
        historicalMessages.forEach(msg => {
            chatContentsHistory.push({
                role: msg.sender === 'USER' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });

        // 10. COMPILE AND STREAM REQUEST TO GOOGLE GENERATIVE AI ENDPOINTS
        const response = await ai.models.generateContent({
            model: resolvedGeminiModel,
            contents: chatContentsHistory,
            config: {
                systemInstruction: `You are an AI Chat Widget that answers questions quickly, efficiently, and succinctly. Enforce these constraints: ${structuralSystemInstruction}`,
                temperature: agent.creativityTemperature ?? 0.7,
                maxOutputTokens: 800,
            }
        });

        const generatedReplyOutput = response.text || "Connection error loops encountered on the generative cluster pathway.";

        // Cache assistant generation payload down to MongoDB logs
        await MessageDB.create({ sessionId: sessionObjectId, sender: 'AGENT', content: generatedReplyOutput });

        // 11. DEBIT QUANTIFIED COMPLETION METRICS FROM CURRENT CHAT RUNTIME POOL ATOMICALLY
        totalTokensSpent = response.usageMetadata?.totalTokenCount || 0;
        console.log(`[Token Expenditure Log]: Deducting ${totalTokensSpent} tokens from user wallet for this interaction.`);
        await UserDB.findByIdAndUpdate(agent.userId, {
            $inc: { chatExecutionToken: -totalTokensSpent } // 🌟 FIXED: Changed from plural to singular field name
        });

        // 12. LOG TELEMETRY AND METER ACCURATELY TO TOKENLEDGERDB FOR SUBSCRIPTION MONITORING
        await TokenLedgerDB.create({
            userId: agent.userId,
            agentId: agent._id,
            promptTokens: response.usageMetadata?.promptTokenCount || 0,
            completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
            totalTokensSpent: totalTokensSpent,
            backboneModelUsed: resolvedGeminiModel
        });

        return res.status(200).json({
            success: true,
            sessionId: sessionObjectId.toString(),
            reply: generatedReplyOutput
        });

    } catch (error: any) {
        console.error("[AgentForge Gemini Core Exception caught]:", error);

        // 🌟 13. AUTOMATED FAILURE RECOVERY: CATCH 429 RATE LIMITS / QUOTA EXHAUSTION
        const isQuotaExhausted = error.status === 429 || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED");

        if (isQuotaExhausted && sessionObjectId) {
            try {
                console.warn("⚠️ [AgentForge Failover Execution]: Gemini API Quota fully depleted. Re-routing streaming traffic to Groq Network Cluster instantly...");

                // Retrieve historical array messages again to compile OpenAI message layout parameters for Groq
                const latestMessagesForBackup = await MessageDB.find({ sessionId: sessionObjectId }).sort({ timestamp: 1 }).limit(30);

                // Build a system parameter instructions object followed by standard chat layout arrays
                const groqFormattedMessages: any[] = [
                    {
                        role: "system",
                        content: `You are an AI Chat Widget that answers questions quickly, efficiently, and succinctly. Enforce these constraints: ${resolvedGeminiModel === "gemini-2.5-flash" ? "Maintain appropriate tone." : ""}\n\n${agent.systemDirective}`
                    }
                ];

                latestMessagesForBackup.forEach(msg => {
                    groqFormattedMessages.push({
                        role: msg.sender === 'USER' ? 'user' : 'assistant',
                        content: msg.content
                    });
                });

                // Fire completion request directly to Groq using a strong, high-velocity model
                const groqResponse = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile", // High speed, smart reasoning token asset alternative
                    messages: groqFormattedMessages,
                    temperature: agent.creativityTemperature ?? 0.7,
                    max_tokens: 800
                });

                const groqReplyText = groqResponse.choices[0]?.message?.content || "Backup communication pipelines failed to synthesize a response frame.";

                // Save assistant fallback generation back down to database logs
                await MessageDB.create({ sessionId: sessionObjectId, sender: 'AGENT', content: groqReplyText });

                // Calculate Groq's token usage footprint to charge the user fairly
                totalTokensSpent = groqResponse.usage?.total_tokens || 0;
                console.log(`[Backup Token Expenditure Log]: Deducting ${totalTokensSpent} backup tokens from user wallet via Groq pipeline.`);

                await UserDB.findByIdAndUpdate(agent.userId, {
                    $inc: { chatExecutionToken: -totalTokensSpent }
                });

                // Write the audit metrics trail into the ledger under the alternative model flag
                await TokenLedgerDB.create({
                    userId: agent.userId,
                    agentId: agent._id,
                    promptTokens: groqResponse.usage?.prompt_tokens || 0,
                    completionTokens: groqResponse.usage?.completion_tokens || 0,
                    totalTokensSpent: totalTokensSpent,
                    backboneModelUsed: "groq/llama-3.3-70b"
                });

                // Return responses cleanly to widget interface
                return res.status(200).json({
                    success: true,
                    sessionId: sessionObjectId.toString(),
                    reply: groqReplyText
                });

            } catch (groqCrash: any) {
                console.error("[AgentForge Critical Cascade System Failure]: Both Gemini and Groq networks failed.", groqCrash);
                return res.status(500).json({ success: false, message: "All cloud computational generation channels are currently unavailable.", error: groqCrash.message });
            }
        }

        return res.status(500).json({ message: "Google AI Studio cluster connection failure.", error: error.message });
    }
};

function getTierRateLimitThreshold(tier: string): number {
    switch (tier) {
        case 'Experience': return 100000;
        case 'Growth': return 5000;
        case 'Starter': return 1000;
        default: return 0;
    }
}