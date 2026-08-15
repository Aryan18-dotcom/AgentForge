import mongoose, { Schema, Document } from "mongoose";

export interface IChatSession extends Document {
    agentId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    sessionTitle: string;
    createdAt: Date;
}

export interface IMessage extends Document {
    sessionId: Schema.Types.ObjectId;
    sender: 'USER' | 'AGENT' | 'SYSTEM';
    content: string;
    timestamp: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionTitle: { type: String, default: 'New Conversation Array' },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 5 * 24 * 60 * 60
  }
});

const MessageSchema = new Schema<IMessage>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender: { type: String, enum: ['USER', 'AGENT', 'SYSTEM'], required: true },
  content: { type: String, required: true },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    expires: 5 * 24 * 60 * 60
  }
});

const ChatSessionDB = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
const MessageDB = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export { ChatSessionDB, MessageDB };