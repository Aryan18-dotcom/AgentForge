import React, { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { fetchAgentFleet } from "./services/api";

export interface Agent {
  _id: string;
  agentName: string;
  backboneModel: 'gpt-4o' | 'claude-3-5' | 'llama-3-70b';
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
    logoSource: 'glyph' | 'custom';
    selectedGlyph: 'sparkle' | 'bot' | 'terminal';
    customLogoUrl: string | null;
  };
  createdAt: string;
}

interface AgentContextType {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  fleetLoading: boolean;
  refreshFleet: () => Promise<void>;
}

export const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [fleetLoading, setFleetLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext); // Ingests user identity to guard calls

  const refreshFleet = async () => {
    // Abort fetch instantly if user is not authenticated or explicitly loaded
    if (!authContext?.user) return;
    
    setFleetLoading(true);
    try {
      const data = await fetchAgentFleet();
      if (data && data.agents) {
        setAgents(data.agents);
      }
    } catch (error: any) {
      console.error("[AgentForge Context Warning] Fleet fetching aborted:", error.message);
    } finally {
      setFleetLoading(false);
    }
  };

  // Automatically load the workforce fleet as soon as a session resolves successfully
  useEffect(() => {
    if (authContext?.user) {
      refreshFleet();
    } else {
      setAgents([]); // Clear workforce footprint on logout instances
    }
  }, [authContext?.user]);

  return (
    <AgentContext.Provider value={{ agents, setAgents, fleetLoading, refreshFleet }}>
      {children}
    </AgentContext.Provider>
  );
};