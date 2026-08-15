import mongoose, { Schema } from "mongoose";

interface ITokenLedger extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  promptTokens: number;
  completionTokens: number;
  totalTokensSpent: number;
  backboneModelUsed: string; // e.g., 'gpt-4o', 'claude-3-5'
  timestamp: Date;
}

interface IAgent extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  agentName: string;
  allowedOrigins: string[];
  backboneModel: 'Professional (Analytical, Corporate, Direct)' | 'Friendly (Approachable, Empathetic, Engaging)' | 'Creative (Brainstorming, Bold, Conversational)' | 'Technical Support (Code-Fluent, Diagnostic, Precise)';
  creativityTemperature: number;
  systemDirective: string;
  vectorMemoryEnabled: boolean;
  status: 'active' | 'paused';
  uiBranding: {
    primaryColor: string;
    secondaryColor: string;
    surfaceColor: string;
    borderRadius: number;
    launcherType: 'icon' | 'text' | 'combined';
    launcherText: string;
    logoSource: 'glyph' | 'custom';
    selectedGlyph: 'sparkle' | 'bot' | 'terminal';
    customLogoUrl: string | null;
    // 🌟 PHASE 3 EXTANDED ANIMATION PROPERTIES
    hoverAnimation: 'none' | 'expand-text' | 'pulse-glow' | 'bounce';
    hoverSpeed: number;
    chatOpenAnimation: 'pop-in' | 'slide-up' | 'fade-in';
    chatCloseAnimation: 'scale-out' | 'slide-down' | 'fade-out';
    chatTransitionSpeed: number;
    entranceAnimation: 'fade-in' | 'slide-up' | 'pop-in';
    entranceSpeed: 'slow' | 'normal' | 'fast';
    entranceDelayDuration: number;
  };
  isActive: boolean;
  createdAt: Date;
}

interface IAssetContext extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
  vectorIngestionStatus: 'PENDING' | 'PROCESSING' | 'PARSED' | 'FAILED';
  createdAt: Date;
}

const TokenLedgerSchema = new Schema<ITokenLedger>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent' },
  promptTokens: { type: Number, required: true, default: 0 },
  completionTokens: { type: Number, required: true, default: 0 },
  totalTokensSpent: { type: Number, required: true },
  backboneModelUsed: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AgentSchema = new Schema<IAgent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentName: { type: String, required: true, trim: true },
  allowedOrigins: {
    type: [String],
    default: []
  },
  backboneModel: { type: String, enum: ['Professional (Analytical, Corporate, Direct)', 'Friendly (Approachable, Empathetic, Engaging)', 'Creative (Brainstorming, Bold, Conversational)', 'Technical Support (Code-Fluent, Diagnostic, Precise)'], default: 'Professional (Analytical, Corporate, Direct)' },
  creativityTemperature: { type: Number, min: 0, max: 1, default: 0.7 },
  systemDirective: { type: String, required: true },
  vectorMemoryEnabled: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'paused'], default: 'active' },
  uiBranding: {
    primaryColor: { type: String, default: '#7c3aed' },
    secondaryColor: { type: String, default: '#4cd7f6' },
    surfaceColor: { type: String, default: '#111827' },
    borderRadius: { type: Number, default: 16 },
    launcherType: { type: String, enum: ['icon', 'text', 'combined'], default: 'combined' },
    launcherText: { type: String, default: 'Chat' },
    logoSource: { type: String, enum: ['glyph', 'custom'], default: 'glyph' },
    selectedGlyph: { type: String, enum: ['sparkle', 'bot', 'terminal'], default: 'sparkle' },
    customLogoUrl: { type: String, default: null },
    // 🌟 PHASE 3 EXTENDED SCHEMA TRACKS & FALLBACKS
    hoverAnimation: { type: String, enum: ['none', 'expand-text', 'pulse-glow', 'bounce'], default: 'expand-text' },
    hoverSpeed: { type: Number, default: 0.3 },
    chatOpenAnimation: { type: String, enum: ['pop-in', 'slide-up', 'fade-in'], default: 'pop-in' },
    chatCloseAnimation: { type: String, enum: ['scale-out', 'slide-down', 'fade-out'], default: 'scale-out' },
    chatTransitionSpeed: { type: Number, default: 0.4 },
    entranceAnimation: { type: String, enum: ['fade-in', 'slide-up', 'pop-in'], default: 'slide-up' },
    entranceSpeed: { type: String, enum: ['slow', 'normal', 'fast'], default: 'normal' },
    entranceDelayDuration: { type: Number, default: 0.5 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const AssetContextSchema = new Schema<IAssetContext>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  storageUrl: { type: String, required: true },
  vectorIngestionStatus: { type: String, enum: ['PENDING', 'PROCESSING', 'PARSED', 'FAILED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const TokenLedgerDB = mongoose.models.TokenLedger || mongoose.model<ITokenLedger>('TokenLedger', TokenLedgerSchema);
const AgentDB = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
const AssetContextDB = mongoose.models.AssetContext || mongoose.model<IAssetContext>('AssetContext', AssetContextSchema);

export { TokenLedgerDB, AgentDB, AssetContextDB };