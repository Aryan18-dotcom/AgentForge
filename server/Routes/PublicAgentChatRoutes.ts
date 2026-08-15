import express from "express";
import { HandleExternalAgentChat } from "../Controllers/AgentChatsController.js";

const publicAgentChat = express.Router();
publicAgentChat.post("/public/:agentId", HandleExternalAgentChat);

export default publicAgentChat;