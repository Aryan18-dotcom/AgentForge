import { useCallback, useEffect, useState } from "react";
import {
  fetchUserProfileDetails,
  UpdateUserProfileDetials,
} from "../services/api";

export interface UserProfile {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string;

  TargetClassification: string;
  WorkSpaceType: string;
  organizationName: string;

  role: string;
  SubscriptionPlan: string;

  isVerified: boolean;
  isSuspended: boolean;
  isActive: boolean;

  agentCreationToken: number;
  chatExecutionToken: number;

  agentSettings?: {
    agentName: string;
    backboneModel: string;
    creativityTemperature: number;
    systemDirective: string;
    vectorMemoryEnabled: boolean;
    status: string;
    uiBranding: string;
    createdAt: string;
  };
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchUserProfileDetails();

      setProfile(data.user);
    } catch (err: any) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (
    payload: FormData | Record<string, any>
  ) => {
    try {
      setUpdating(true);

      const response = await UpdateUserProfileDetials(payload);

      await loadProfile();

      return response;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    updating,
    error,
    reloadProfile: loadProfile,
    updateProfile,
  };
};