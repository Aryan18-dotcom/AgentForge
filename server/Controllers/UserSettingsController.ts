import mongoose from "mongoose";
import UserDB from "../Models/UserModel.js";
import { AgentDB } from "../Models/AgentModels.js";
import { uploadToCloudinary } from "../Helper/upoadToCloud.js";
import { Request, Response } from "express";

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        // Safe context access: your isAuthenticated middleware guarantees req.session.userId exists
        const { userId } = req.session;

        // Fetch user document and convert to a plain JS object so we can append unmapped fields
        const userDoc = await UserDB.findById(userId as string).select("-password -refreshToken");
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userDoc.toObject();

        // Fetch associated agent schema configurations safely
        const agentData = await AgentDB.find({ userId: new mongoose.Types.ObjectId(userId) })
            .select("agentName backboneModel vectorMemoryEnabled status createdAt")
            .lean(); // .lean() yields a fast, plain object representation automatically

        // Seamlessly stitch agent telemetry to user object profile response
        user.agentSettings = agentData || null;

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Server error during profile retrieval" });
    }
};

export const updateUserProfileSettings = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Safe context access: your isAuthenticated middleware guarantees req.session.userId exists
        const { userId } = req.session;

        // Multer parsing engine pipes multipart file data boundaries natively under req.file
        const file = req.file;
        let cloudinaryUrl = null;

        try {
            // Upload the raw document buffer to Cloudinary if a file asset was provided
            if (file) {
                cloudinaryUrl = await uploadToCloudinary(file.buffer, userId!);
                console.log("Cloudinary Upload Success. URL:", cloudinaryUrl);
            }
        } catch (uploadError: any) {
            await session.abortTransaction();
            session.endSession();
            console.error("Cloudinary Upload Exception:", uploadError);
            return res.status(400).json({ message: "Failed to upload file asset to Cloudinary", error: uploadError.message });
        }

        const { fullName, email, TargetClassification, WorkSpaceType, organizationName } = req.body || {};
        const user = await UserDB.findById(userId).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User profile record not found" });
        }

        // Apply fallback mutations cleanly
        user.fullName = fullName !== undefined ? fullName : user.fullName;
        user.email = email !== undefined ? email : user.email;
        user.TargetClassification = TargetClassification !== undefined ? TargetClassification : user.TargetClassification;
        user.WorkSpaceType = WorkSpaceType !== undefined ? WorkSpaceType : user.WorkSpaceType;
        user.organizationName = organizationName !== undefined ? organizationName : user.organizationName;
        
        if (cloudinaryUrl) {
            user.profilePictureUrl = cloudinaryUrl;
        }

        await user.save({ session });
        await session.commitTransaction();
        session.endSession(); // Close down allocated session engine blocks

        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        await session.abortTransaction();
        session.endSession(); // Clean up allocations on absolute code pipeline failure
        return res.status(500).json({ success: false, message: "Server error during data pipeline modification" });
    }
};