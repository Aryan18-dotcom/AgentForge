export interface RegisterOtpPayload {
  username: string;
  email: string;
}

export interface RegisterPayload {
  userName: string; // ✅ Matches frontend casing sent to backend
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  workSpaceType: 'Personal' | 'Organization'; //
  organizationName: string | null; //
  targetClassification: 'FreeLance/Solo' | 'SandBox Testing' | 'Team Orchestration'; //
  otp: string;
}

// =========================================================================
// ✧ CORE IDENTITY UTILITIES & RESPONSES
// =========================================================================

export interface LoginPayload {
  userId: string; // Accepts Username or Email inputs natively
  password?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'OPERATOR'; // ✅ Aligned with backend enums
  workspace: 'Personal' | 'Organization'; //
  subscriptionPlan: 'Free' | 'Starter' | 'Growth' | 'Experience'; //
  agentCreationToken?: number; // Tracks available forge credits
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface GeneralAuthResponse {
  success: boolean;
  message: string;
}