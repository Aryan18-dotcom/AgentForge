import handleResponse from "../../../helper/HandleResponse";

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

export async function getDashboardMetrix(){
    const response = await fetch(`${BASE_URL}/auth/dashboard-metrix`, {
        method: "GET", 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
    return handleResponse(response)
}