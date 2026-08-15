import { useContext, useState } from "react";
import {
  forgeNewAgent, updateAgentConfiguration,
  toggleAgentState, decommissionAgentPipeline, fetchAgentDetails
} from "../services/api";
import { AgentContext } from "../agentContext";
import { AuthContext } from "../../auth/authContext";

export const useAgent = () => {
  const context = useContext(AgentContext);
  const auth = useContext(AuthContext); // To adjust user credits in real time
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  if (!context) {
    throw new Error("useAgent hook must be deployed within an explicit <AgentProvider /> track.");
  }

  const { agents, setAgents, fleetLoading, refreshFleet } = context;

  // ✧ FORGE: Action dispatch for user submission sheets
  const forgeAgent = async (payload: any) => {
    setActionLoading(true);
    try {
      // ✅ FIXED: Pass payload (FormData or JSON Object) completely untampered to the client layout
      const data = await forgeNewAgent(payload);

      // Update local context array and append newly spawned agent layout directly
      if (data.success && data.agent) {
        setAgents(prev => [data.agent, ...prev]);

        // Sync deducted credit token counters across global states
        if (auth?.user && data.remainingTokens !== undefined) {
          auth.setUser({ ...auth.user, agentCreationToken: data.remainingTokens });
        }
      }
      return { success: true, message: data.message, agent: data.agent };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to finalize compilation protocol." };
    } finally {
      setActionLoading(false);
    }
  };

  // ✧ TOGGLE: Rapid status switcher state mutation
  const toggleAgentOperationalState = async (agentId: string) => {
    // Optimistic UI updates to avoid layout lag
    const originalAgents = [...agents];
    setAgents(prev => prev.map(agent =>
      agent._id === agentId
        ? { ...agent, status: agent.status === 'active' ? 'paused' : 'active' }
        : agent
    ));

    try {
      const data = await toggleAgentState(agentId);
      return { success: true, status: data.status };
    } catch (err: any) {
      // Rollback to original stack constraints if network fails
      setAgents(originalAgents);
      return { success: false, message: err.message || "Failed to switch operational paths." };
    }
  };

  // ✧ UPDATE: Alter parameters configuration strings
const updateAgent = async (agentId: string, updates: any) => {
  setActionLoading(true);
  try {
    const data = await updateAgentConfiguration(agentId, updates);
    
    if (data.success && data.agent) {
      setAgents(prev => prev.map(agent => agent._id === agentId ? data.agent : agent));
    }
    
    return { success: true, message: data.message || "Configuration updated successfully." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to rewrite core matrix traits." };
  } finally {
    setActionLoading(false);
  }
};

  // ✧ DELETE: Complete pipeline decommission
  const decommissionAgent = async (agentId: string) => {
    setActionLoading(true);
    try {
      await decommissionAgentPipeline(agentId);
      // Evict asset slice from local reactive UI arrays instantly
      setAgents(prev => prev.filter(agent => agent._id !== agentId));
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Decommission validation handshakes rejected." };
    } finally {
      setActionLoading(false);
    }
  };

  // ✧ VIEW SINGLE: Fetch un-cached isolated tracking log arrays
  const getAgentDetails = async (agentId: string) => {
    try {
      return await fetchAgentDetails(agentId);
    } catch (err: any) {
      throw new Error(err.message || "Failed to compile individual telemetry.");
    }
  };

  return {
    agents,
    fleetLoading,
    actionLoading,
    refreshFleet,
    forgeAgent,
    toggleAgentOperationalState,
    updateAgent,
    decommissionAgent,
    getAgentDetails
  };
};