import mongoose, { Document, Schema } from "mongoose";
import OtpDB from "./OTPModel.js";

export interface IUser extends Document {
    username: string;
    fullName: string;
    email: string;
    passwordHash: string;
    TargetClassification: 'FreeLance/Solo' | 'SandBox Testing' | 'Team Orchestration';
    WorkSpaceType: 'Personal' | 'Organization';
    organizationName: string | null;
    role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'OPERATOR';
    SubscriptionPlan: 'Free' | 'Starter' | 'Growth' | 'Experience';
    isVerified: boolean;
    isSuspended: boolean;
    isActive: boolean;
    refreshToken: string | null;
    agentCreationToken?: number;
    chatExecutionToken?: number; // Keep singular nomenclature clean
    stripeCustomerId?: string | null;
    profilePictureUrl?: string | null;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    TargetClassification: { type: String, enum: ['FreeLance/Solo', 'SandBox Testing', 'Team Orchestration'], required: true },
    WorkSpaceType: { type: String, enum: ['Personal', 'Organization'], required: true },
    organizationName: { type: String, default: null },
    role: { type: String, enum: ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'OPERATOR'], default: 'OPERATOR' },
    SubscriptionPlan: { type: String, enum: ['Free', 'Starter', 'Growth', 'Experience'], default: 'Free' },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, default: null },
    
    // 🌟 SEED SAFE DEFAULT LOWER LIMITS BELOW FOR BETTER SANDBOX ALLOCATIONS
    agentCreationToken: { type: Number, default: 20 }, // Changes base starting pool to 20 for free testing configuration setups
    chatExecutionToken: { type: Number, default: 0 },   // Sets to 0 by default to lock conversational paths on free accounts
    stripeCustomerId: { type: String, default: null },
    profilePictureUrl: { type: String, default: null }
});

UserSchema.pre('findOneAndDelete', async function () {
    const userId = this.getQuery()._id;
    if (!userId) return;

    try {
        console.log(`Cascading delete initiated for User: ${userId}`);
        await Promise.all([
            OtpDB.deleteMany({ userId: userId }),
        ]);
        console.log(`Successfully cleared data for User: ${userId}`);
    } catch (err: any) {
        console.error(`Cascade delete failed: ${err.message}`);
        throw err;
    }
});

const UserDB = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserDB;