import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
    userId?: mongoose.Types.ObjectId; // Reference to the User
    email: string;
    otp: string;
    purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
    createdAt: Date;
}

const OtpSchema = new Schema<IOTP>({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Matches the name of your User model
        required: false 
    },
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        index: true // Index for faster lookups
    },
    otp: { 
        type: String, 
        required: true 
    },
    purpose: {
        type: String,
        enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'],
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 300 // Auto-deletes after 5 minutes
    }
});

const OtpDB = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OtpSchema);
export default OtpDB;