import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IPayment extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    subscriptionTier: 'Free' | 'Starter' | 'Growth' | 'Experience';
    paymentMode: string;
    gatewayTransactionId: string;
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    validityExpiresAt: Date;
    createdAt: Date;
};

// Payment Schema
const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionTier: { type: String, enum: ['Free', 'Starter', 'Growth', 'Experience'], required: true },
  paymentMode: { type: String, required: true }, // e.g., 'Stripe', 'Razorpay', 'UPI'
  gatewayTransactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], required: true },
  validityExpiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PaymentDB = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default PaymentDB;