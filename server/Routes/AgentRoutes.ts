import multer from "multer";
import {
    ForgeAgent, GetUserAgents, GetAgentDetails,
    UpdateAgentConfig, ToggleAgentOperationalState, DecommissionAgent,
    GetAgentDetailsPublic
} from "../Controllers/BuildingAgentController.js";
import isAuthenticated from "../Middlewares/Auth.js";
import express from "express";

const AgentRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
        fieldSize: 15 * 1024 * 1024
    }
});

// --- CORE ASSETS INGRESS MATRIX MAPPING ---
AgentRouter.post("/forge", isAuthenticated, upload.single("contextFile"), ForgeAgent);               // Create
AgentRouter.get("/fleet", isAuthenticated, GetUserAgents);             // Read Roster
AgentRouter.get("/details/:agentId", isAuthenticated, GetAgentDetails); // Read Individual Specs
AgentRouter.get("/public/details/:agentId", GetAgentDetailsPublic); // Read Public Individual Specs

AgentRouter.put("/update/:agentId", isAuthenticated, upload.single("contextFile"), UpdateAgentConfig); // Update Parameters
AgentRouter.patch("/toggle/:agentId", isAuthenticated, ToggleAgentOperationalState); // Toggle state status lines
AgentRouter.delete("/decommission/:agentId", isAuthenticated, DecommissionAgent); // Delete Cascade Tracking

export default AgentRouter;