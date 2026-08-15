import handleResponse from "../../../helper/HandleResponse";

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

export async function fetchUserProfileDetails() {
    const response = await fetch(`${BASE_URL}/profile/details`, {
        method: "GET", 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
    return handleResponse(response)
}

export async function UpdateUserProfileDetials(payload: any){
    const isMultipart = payload instanceof FormData;
    const header: Record<string, string> = {};

    if (!isMultipart) {
        header["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}/profile/update-profile`, {
        method: "PUT",
        headers: header,
        credentials: "include",
        body: isMultipart ? payload : JSON.stringify(payload),
    });

    return handleResponse(response);
}