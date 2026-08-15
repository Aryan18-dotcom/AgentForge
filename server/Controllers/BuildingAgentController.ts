import { Request, Response } from "express";
import mongoose from "mongoose";
import UserDB from "../Models/UserModel.js";
import { AgentDB, AssetContextDB, TokenLedgerDB } from "../Models/AgentModels.js";
import { ChatSessionDB, MessageDB } from "../Models/ChatSession.js";
import { uploadToCloudinary } from "../Helper/upoadToCloud.js";

const PLAN_ALLOWED_DOMAINS_LIMIT: Record<string, number> = {
    'Free': 0, // Block or restrict domain customization on free tier if necessary
    'Starter': 1,
    'Growth': 2,
    'Experience': 4
};

// =========================================================================
// ✧ CREATE: FORGE NEW AGENT Workhorse
// =========================================================================

const sanitizeDomainsArray = (domains: any): string[] => {
    if (!domains) return [];
    
    // Parse if received as a stringified JSON array via FormData
    let rawArray: any[] = [];
    if (typeof domains === 'string') {
        try {
            rawArray = JSON.parse(domains);
        } catch {
            // Fall back to treating it as a single comma-separated or plain string entry
            rawArray = domains.split(',').map(d => d.trim());
        }
    } else if (Array.isArray(domains)) {
        rawArray = domains;
    }

    return rawArray
        .map(domain => String(domain)
            .trim()
            .replace(/^https?:\/\//i, '') // Strip protocols
            .split('/')[0]                // Strip route branches
            .toLowerCase()
        )
        .filter(Boolean);
};

export const ForgeAgent = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.session.userId;
        if (!userId) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Authentication context dropped. Log in first." });
        }

        const file = req.file; 
        let cloudinaryUrl: string | null = null;

        try {
            if (file) {
                cloudinaryUrl = await uploadToCloudinary(file.buffer, userId.toString()) as string;
                console.log("Cloudinary Upload Success. URL:", cloudinaryUrl);
            }
        } catch (uploadError: any) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Failed to upload file asset to Cloudinary", error: uploadError.message });
        }

        const {
            agentName, backboneModel, creativityTemperature, systemDirective,
            vectorMemoryEnabled, allowedDomains
        } = req.body;

        console.log(allowedDomains)

        let uiBranding = req.body.uiBranding;
        if (typeof uiBranding === 'string') {
            try { uiBranding = JSON.parse(uiBranding); } catch { uiBranding = {}; }
        }

        const user = await UserDB.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Operator profile trace missing in this cluster" });
        }

        const currentTokens = user.agentCreationToken ?? 0;
        if (currentTokens <= 0) {
            await session.abortTransaction();
            return res.status(403).json({
                message: "Insufficient agent creation credits. Please visit the subscription pipeline to purchase additional tokens."
            });
        }

        // 🌟 SAAS WHITELISTING VALIDATION FOR CREATION
        const processedDomains = sanitizeDomainsArray(allowedDomains);
        const userPlan = user.SubscriptionPlan || 'Free'; // Fallback if property is unset
        const maxAllowedLimits = PLAN_ALLOWED_DOMAINS_LIMIT[userPlan] ?? 0;

        if (processedDomains.length > maxAllowedLimits) {
            await session.abortTransaction();
            return res.status(403).json({
                message: `Domain allotment boundary breached. Your current '${userPlan}' profile tier restricts allocation to a maximum of ${maxAllowedLimits} customized tracking link nodes.`
            });
        }

        let finalSystemDirective = "Default system initialization context missing.";
        if (systemDirective) {
            finalSystemDirective = systemDirective.trim();
        }

        const newAgentArray = await AgentDB.create([{
            userId,
            agentName: agentName.trim(),
            backboneModel,
            creativityTemperature: parseFloat(creativityTemperature) || 0.7,
            systemDirective: finalSystemDirective,
            vectorMemoryEnabled: vectorMemoryEnabled === 'true' || vectorMemoryEnabled === true,
            allowedOrigins: processedDomains, // 🌟 Save verified string elements cleanly
            status: 'active',
            uiBranding: {
                primaryColor: uiBranding?.primaryColor ?? '#7c3aed',
                secondaryColor: uiBranding?.secondaryColor ?? '#4cd7f6',
                surfaceColor: uiBranding?.surfaceColor ?? '#111827',
                borderRadius: parseInt(uiBranding?.borderRadius) || 16,
                launcherType: uiBranding?.launcherType ?? 'combined',
                launcherText: uiBranding?.launcherText ?? 'Chat',
                logoSource: uiBranding?.logoSource ?? 'glyph',
                selectedGlyph: uiBranding?.selectedGlyph ?? 'sparkle',
                customLogoUrl: uiBranding?.customLogoUrl ?? null,
                hoverAnimation: uiBranding?.hoverAnimation ?? 'expand-text',
                hoverSpeed: parseFloat(uiBranding?.hoverSpeed) || 0.3,
                chatOpenAnimation: uiBranding?.chatOpenAnimation ?? 'pop-in',
                chatCloseAnimation: uiBranding?.chatCloseAnimation ?? 'scale-out',
                chatTransitionSpeed: parseFloat(uiBranding?.chatTransitionSpeed) || 0.4,
                entranceAnimation: uiBranding?.entranceAnimation ?? 'slide-up',
                entranceSpeed: uiBranding?.entranceSpeed ?? 'normal',
                entranceDelayDuration: parseFloat(uiBranding?.entranceDelayDuration) || 0.5
            },
            isActive: true
        }], { session });

        const createdAgent = newAgentArray[0];

        if (file) {
            await AssetContextDB.create([{
                userId,
                agentId: createdAgent._id,
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                storageUrl: cloudinaryUrl || "", 
                vectorIngestionStatus: 'PENDING'
            }], { session });
        }

        const isVector = vectorMemoryEnabled === 'true' || vectorMemoryEnabled === true;
        let message;
        if (isVector) {
            user.agentCreationToken = currentTokens - 60;
            message = "Agent cluster forged successfully. 60 credits deducted for agent creation and vector memory initialization.";
        } else {
            user.agentCreationToken = currentTokens - 10;
            message = "Agent cluster forged successfully. 10 credits deducted for agent creation.";
        }
        await user.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: message,
            remainingTokens: user.agentCreationToken,
            agent: createdAgent
        });

    } catch (error: any) {
        await session.abortTransaction();
        console.error("ForgeAgent System Exception:", error);
        return res.status(500).json({ message: "Failed to forge agent worker asset", error: error.message });
    } finally {
        session.endSession();
    }
};

// =========================================================================
// ✧ READ: VIEW AGENT ROSTER FLEET & SINGLE TELEMETRY
// =========================================================================
export const GetUserAgents = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ message: "Unauthenticated context access" });

        // Fetch running fleet records belonging strictly to this user
        const agents = await AgentDB.find({ userId, isActive: true }).sort({ createdAt: -1 }); //
        return res.status(200).json({ success: true, count: agents.length, agents });
    } catch (error: any) {
        return res.status(500).json({ message: "Failed to resolve agent roster array logs", error: error.message });
    }
};

export const GetAgentDetails = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const userId = req.session.userId;

        const agent = await AgentDB.findOne({ _id: agentId, userId }); //
        if (!agent) {
            return res.status(404).json({ message: "Agent architecture layout index not found in this workspace" });
        }

        // Populate context document assets simultaneously
        const files = await AssetContextDB.find({ agentId }); //

        return res.status(200).json({ success: true, agent, files });
    } catch (error: any) {
        return res.status(500).json({ message: "Error locating individual agent profile logs", error: error.message });
    }
};

export const GetAgentDetailsPublic = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const agent = await AgentDB.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: "Agent profile not found" });
        }
        return res.status(200).json({ success: true, agent });
    } catch (error: any) {
        return res.status(500).json({ message: "Error retrieving public agent profile", error: error.message });
    }
};

// =========================================================================
// ✧ UPDATE: EDIT PARAMETERS & CONFIGURATIONS
// =========================================================================
export const UpdateAgentConfig = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Authentication context dropped. Log in first." });
        }

        const file = req.file;
        let cloudinaryUrl: string | null = null;

        if (file) {
            try {
                cloudinaryUrl = await uploadToCloudinary(file.buffer, userId.toString()) as string;
                console.log("Cloudinary Update Success. URL:", cloudinaryUrl);
            } catch (uploadError: any) {
                return res.status(400).json({ message: "Failed to upload new file asset to Cloudinary", error: uploadError.message });
            }
        }

        const updates = { ...req.body };
        delete updates.userId;
        delete updates._id;

        // Fetch User profile metadata layout structure to gauge allocation validation keys
        const user = await UserDB.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Operator profile trace missing in this cluster" });
        }

        // 🌟 SAAS WHITELISTING VALIDATION FOR UPDATES
        if (updates.allowedDomains !== undefined) {
            const processedDomains = sanitizeDomainsArray(updates.allowedDomains);
            const userPlan = user.SubscriptionPlan || 'Free';
            const maxAllowedLimits = PLAN_ALLOWED_DOMAINS_LIMIT[userPlan] ?? 0;

            if (processedDomains.length > maxAllowedLimits) {
                return res.status(403).json({
                    message: `Update execution terminated. Your standard '${userPlan}' profile layout layer limits setup options to ${maxAllowedLimits} target records.`
                });
            }
            // Bind back the sanitized tracking data explicitly
            updates.allowedDomains = processedDomains;
        }

        if (updates.uiBranding && typeof updates.uiBranding === 'string') {
            try {
                updates.uiBranding = JSON.parse(updates.uiBranding);
            } catch (e) {
                delete updates.uiBranding;
            }
        }

        if (updates.vectorMemoryEnabled !== undefined) {
            updates.vectorMemoryEnabled = updates.vectorMemoryEnabled === 'true' || updates.vectorMemoryEnabled === true;
        }
        
        if (updates.creativityTemperature !== undefined) {
            updates.creativityTemperature = parseFloat(updates.creativityTemperature) || 0.7;
        }

        if (file && cloudinaryUrl) {
            await AssetContextDB.findOneAndUpdate(
                { agentId, userId },
                {
                    $set: {
                        fileName: file.originalname,
                        fileType: file.mimetype,
                        fileSize: file.size,
                        storageUrl: cloudinaryUrl,
                        vectorIngestionStatus: 'PENDING'
                    }
                },
                { upsert: true, new: true }
            );
        }

        const updatedAgent = await AgentDB.findOneAndUpdate(
            { _id: agentId, userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedAgent) {
            return res.status(404).json({ message: "Failed to modify configuration. Asset trace missing." });
        }

        return res.status(200).json({
            success: true,
            message: "Core parameters successfully re-aligned inside production clusters",
            agent: updatedAgent
        });

    } catch (error: any) {
        console.error("[AgentForge Config Update Exception]:", error);
        return res.status(500).json({ message: "Failed to update target agent configuration variables", error: error.message });
    }
};

// =========================================================================
// ✧ TOGGLE: PAUSE OR RESUME OPERATIONS STATE
// =========================================================================
export const ToggleAgentOperationalState = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const userId = req.session.userId;

        const agent = await AgentDB.findOne({ _id: agentId, userId });
        if (!agent) return res.status(404).json({ message: "Target model container dropped or missing" });

        // Flips runtime processing status lines natively
        agent.status = agent.status === 'active' ? 'paused' : 'active'; //
        await agent.save();

        return res.status(200).json({
            success: true,
            message: `Agent execution loops explicitly changed to status: ${agent.status}`, //
            status: agent.status //
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Operational state modifier handshakes timed out", error: error.message });
    }
};

// =========================================================================
// ✧ DELETE: DECOMMISSION PIPELINE ASSET (CASCADING PURGE)
// =========================================================================
export const DecommissionAgent = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { agentId } = req.params;
        const userId = req.session.userId;

        const agent = await AgentDB.findOne({ _id: agentId, userId }).session(session); //
        if (!agent) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Pipeline asset signature not matched inside this user space" });
        }

        // 1. Flush chat conversation channels and messaging string nodes
        const relatedSessions = await ChatSessionDB.find({ agentId }).session(session); //
        const sessionIds = relatedSessions.map(s => s._id);

        await Promise.all([
            MessageDB.deleteMany({ sessionId: { $in: sessionIds } }).session(session), //
            ChatSessionDB.deleteMany({ agentId }).session(session), //
            AssetContextDB.deleteMany({ agentId }).session(session), //
            TokenLedgerDB.deleteMany({ agentId }).session(session), //
            AgentDB.deleteOne({ _id: agentId }).session(session) //
        ]);

        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message: "Agent decommission sequence successful. Associated vector contexts and chat caches purged cleanly."
        });

    } catch (error: any) {
        await session.abortTransaction();
        console.error("DecommissionAgent Failure:", error);
        return res.status(500).json({ message: "Decommissioning loop failed to process cascade trees", error: error.message });
    } finally {
        session.endSession();
    }
};