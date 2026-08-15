import handleResponse from "../../../helper/HandleResponse";

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

// Forge/Create a new Agent pipeline
export async function forgeNewAgent(payload: any) {
  // Determine if we are transmitting binary multi-part streams or a plain text JSON object
  const isMultipart = payload instanceof FormData;

  const headers: Record<string, string> = {};

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  // 🌟 FIXED: When isMultipart is true, we leave the Content-Type header completely empty.
  // This permits the browser to natively assign a multi-part boundary string!

  const response = await fetch(`${BASE_URL}/agents/forge`, {
    method: "POST",
    headers: headers,
    credentials: "include",
    body: isMultipart ? payload : JSON.stringify(payload), // ✅ Pass raw FormData directly
  });

  return handleResponse(response);
}

// Fetch all agents belonging to the authenticated operator
export async function fetchAgentFleet() {
  const response = await fetch(`${BASE_URL}/agents/fleet`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}

// Fetch a single agent's exhaustive telemetry specs and files
export async function fetchAgentDetails(agentId: string) {
  const response = await fetch(`${BASE_URL}/agents/details/${agentId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}

// Update an agent's configuration variables 
export async function updateAgentConfiguration(agentId: string, updates: any) {
  // Determine if the incoming update payload contains a multipart stream or a flat JSON string object
  const isMultipart = updates instanceof FormData;

  const headers: Record<string, string> = {};

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  // 🌟 FIXED: Omitting the manual Content-Type header when isMultipart is true 
  // allows the browser to assign its own multipart/form-data boundaries seamlessly.

  const response = await fetch(`${BASE_URL}/agents/update/${agentId}`, {
    method: "PUT",
    headers: headers,
    credentials: "include",
    body: isMultipart ? updates : JSON.stringify(updates),
  });

  return handleResponse(response);
}

// Toggle an agent's status between 'active' and 'paused'
export async function toggleAgentState(agentId: string) {
  const response = await fetch(`${BASE_URL}/agents/toggle/${agentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}

// Decommission an agent and wipe associated database caches
export async function decommissionAgentPipeline(agentId: string) {
  const response = await fetch(`${BASE_URL}/agents/decommission/${agentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}