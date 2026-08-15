import handleResponse from "../../../helper/HandleResponse";
import type { LoginPayload } from "../../../types/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

// ✧ Request OTP for registration
export async function requestRegistrationOTP({ username, email }: { username: string; email: string }) {
  const response = await fetch(`${BASE_URL}/auth/register/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email }),
  });
  return handleResponse(response);
}

// ✧ Verify and Register (Commit to DB)
export async function verifyAndRegister(payload: any) {
  const response = await fetch(`${BASE_URL}/auth/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

// LOGIN SERVICE
export async function login({ userId, password }: LoginPayload): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, password }),
  });
  return handleResponse(response);
}

// LOGOUT SERVICE
export async function logout(): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}

// GET CURRENT USER
export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/auth/current-user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
}

// ✧ REQUEST RESET OTP
export async function requestPasswordResetOTP(email: string) {
  const response = await fetch(`${BASE_URL}/auth/password/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

// ✧ VERIFY RESET OTP
export async function verifyPasswordResetOTP(email: string, otp: string) {
  const response = await fetch(`${BASE_URL}/auth/password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(response);
}

// ✧ RESET PASSWORD
export async function resetPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  const response = await fetch(`${BASE_URL}/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}