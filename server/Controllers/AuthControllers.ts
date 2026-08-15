import { Request, Response } from "express";
import mongoose from "mongoose";
import UserDB from "../Models/UserModel.js";
import OtpDB from "../Models/OTPModel.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../Configs/HelperFunctions.js";

// --- PHASE 1: REQUEST REGISTRATION OTP ---
export const RequestRegistrationOTP = async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;
        console.log(`[AgentForge Forge Log] Received registration OTP request for email: ${email}, username: ${username}`);

        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are explicitly required' });
        }

        // 1. Verify credentials don't collide against unique indexes
        const existingUser = await UserDB.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.trim() }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already provisioned in our cluster logs' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save or cycle OTP using our optimized non-blocking registration standard
        await OtpDB.findOneAndUpdate(
            { email: email.toLowerCase(), purpose: 'REGISTRATION' },
            { otp, createdAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        // 3. Dispatch Email System Node
        await sendOtpEmail(email.toLowerCase(), otp); 
        console.log(`[AgentForge Forge Log] Registration Verification Code for ${email}: ${otp}`);

        return res.status(200).json({ success: true, message: "Verification matrix code routed to your email address" });
    } catch (error: any) {
        return res.status(500).json({ message: "Error sending verification OTP", error: error.message });
    }
};

// --- PHASE 2: VERIFY AND COMPILATION SIGNUP ---
export const VerifyAndRegister = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // FIXED: Destructured key names to perfectly match your frontend JSON payload casing
        const { 
            userName, email, password, otp, fullName,
            workSpaceType, organizationName, targetClassification
        } = req.body;

        // Check for required elements before continuing
        if (!email || !password || !otp || !userName || !workSpaceType || !targetClassification) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Required registration parameters are missing from payload" });
        }

        // 1. Verify Registration OTP explicitly matching our intent channel
        const otpRecord = await OtpDB.findOne({ 
            email: email.toLowerCase(), 
            otp, 
            purpose: 'REGISTRATION' 
        });
        
        if (!otpRecord) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid or expired verification parameters" });
        }

        // 2. Hash Password string securely
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Compile User document safely mapping frontend keys to backend database schema schemas
        const newUserArray = await UserDB.create([{
            username: userName.trim(), // 👈 Mapped from 'userName'
            fullName,
            email: email.toLowerCase(),
            passwordHash,
            TargetClassification: targetClassification, // 👈 Mapped from 'targetClassification' ('FreeLance/Solo')
            WorkSpaceType: workSpaceType, // 👈 Mapped from 'workSpaceType' ('Personal')
            organizationName: organizationName || null,
            role: 'ORGANIZATION_ADMIN', 
            SubscriptionPlan: 'Free',
            isVerified: true,
            isActive: true,
            agentCreationToken: 50,
            chatExecutionToken: 0
        }], { session });

        const createdUser = newUserArray[0];

        // 4. Consume and flush registration OTP so it cannot be double-spent
        await OtpDB.deleteOne({ _id: otpRecord._id }).session(session);

        await session.commitTransaction();

        // 5. Build Persistent Browser Cookie Sessions
        req.session.isLoggedIn = true;
        req.session.userId = createdUser._id.toString();

        return res.status(201).json({
            success: true,
            message: 'AgentForge workforce initialization sequence completed successfully',
            user: {
                id: createdUser._id,
                username: createdUser.username,
                fullName: createdUser.fullName,
                email: createdUser.email,
                role: createdUser.role,
                subscriptionPlan: createdUser.SubscriptionPlan
            }
        });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('VerifyAndRegister Operational Error Details:', error);
        return res.status(500).json({ message: "Registration matrix configuration failed", error: error.message });
    } finally {
        session.endSession();
    }
};

// --- PHASE 3: RESEND OTP PIPELINE ---
export const ResendOTP = async (req: Request, res: Response) => {
    try {
        const { email, purpose } = req.body; // e.g., purpose: 'REGISTRATION' or 'PASSWORD_RESET'

        if (!email || !purpose) {
            return res.status(400).json({ message: "Email and purpose parameters are required to cycle keys" });
        }

        const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await OtpDB.findOneAndUpdate(
            { email: email.toLowerCase(), purpose },
            { otp: freshOtp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // await sendOtpEmail(email.toLowerCase(), freshOtp);
        console.log(`[AgentForge Forge Log] Resent ${purpose} Token to ${email}: ${freshOtp}`);

        return res.status(200).json({ message: `A fresh security array token has been routed for ${purpose.toLowerCase()}` });
    } catch (error: any) {
        return res.status(500).json({ message: "Failed to recalculate secure OTP", error: error.message });
    }
};

// --- PHASE 4: SECURE ACCOUNT USER LOGIN ---
export const LoginUser = async (req: Request, res: Response) => {
    try {
        const { userId, password } = req.body; // userId handles passing username OR email addresses natively

        if (!userId || !password) {
            return res.status(400).json({ message: "Identity credentials and password string required" });
        }

        // 1. Resolve user node against credential attributes
        const user = await UserDB.findOne({ $or: [{ email: userId.toLowerCase() }, { username: userId.trim() }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid identification parameters or password match" });
        }

        // 2. Audit administrative suspension statuses
        if (user.isSuspended || !user.isActive) {
            return res.status(403).json({ message: "This system account asset has been temporarily decommissioned" });
        }

        // 3. Verify cryptographic hash integrity
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid identification parameters or password match" });
        }

        // 4. Mount active session tokens
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();

        return res.status(200).json({
            message: "Authentication protocol accepted successfully",
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                workspace: user.WorkSpaceType,
                SubscriptionPlan: user.SubscriptionPlan
            }
        });
    } catch (error: any) {
        console.error("LoginUser System Exception:", error);
        return res.status(500).json({ message: "Server connection timeout error", error: error.message });
    }
};

// --- PHASE 5: DESTROY ACCOUNT LOGOUT CONTEXT ---
export const LogoutUser = (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
        if (err) {
            return res.status(500).json({ message: 'Logout termination request rejected', error: err });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Session dropped and security cookies cleared cleanly' });
    });
};

// --- PHASE 6: FETCH ACTIVE CONTEXT USER DATA ---
export const GetCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.session.isLoggedIn || !req.session.userId) {
            return res.status(401).json({ message: 'No active authentication handshake detected' });
        }

        // Project everything except our critical private passwordHash strings
        const user = await UserDB.findById(req.session.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'Identity array entry missing inside this user cluster' });
        }

        return res.status(200).json({ user });
    } catch (error: any) {
        return res.status(500).json({ message: 'Server context extraction error', error: error.message });
    }
};

// --- PHASE 7: PASSWORD RESET TRIGGER CHANNELS ---
export const RequestPasswordResetOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email parameter context required" });
        }

        const user = await UserDB.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "No registered profile located matching this address" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save specifically stamped with our PASSWORD_RESET isolation purpose tag
        await OtpDB.findOneAndUpdate(
            { email: email.toLowerCase(), purpose: 'PASSWORD_RESET' },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // await sendOtpEmail(email.toLowerCase(), otp);
        console.log(`[AgentForge Forge Log] Password Reset Token routed to ${email}: ${otp}`);

        return res.status(200).json({ success: true, message: "Password reset authorization token routed to email" });
    } catch (error: any) {
        return res.status(500).json({ message: "Error compiling recovery handshake", error: error.message });
    }
};

export const VerifyPasswordResetOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OtpDB.findOne({
            email: email.toLowerCase(),
            otp,
            purpose: 'PASSWORD_RESET'
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired recovery key parameters" });
        }

        return res.status(200).json({ success: true, message: "Recovery code handshake checked and verified" });
    } catch (error: any) {
        return res.status(500).json({ message: "Verification processing timeout", error: error.message });
    }
};

export const ResetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Re-authenticate token explicitly for multi-layered pipeline security
        const otpRecord = await OtpDB.findOne({
            email: email.toLowerCase(),
            otp,
            purpose: 'PASSWORD_RESET'
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Authorization parameters invalid. Complete verification step again" });
        }

        const user = await UserDB.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "Profile entry trace dropped during calculation steps" });
        }

        // Hash and rewrite credentials
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Explicitly clear recovery record token after successful account password rewrite sequence
        await OtpDB.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({ success: true, message: "Credential hash updated safely. Use your new password to login" });
    } catch (error: any) {
        return res.status(500).json({ message: "Failed to overwrite password state", error: error.message });
    }
};