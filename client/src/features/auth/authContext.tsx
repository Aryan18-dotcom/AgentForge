import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser } from "./services/api";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  TargetClassification: 'FreeLance/Solo' | 'SandBox Testing' | 'Team Orchestration';
  WorkSpaceType: 'Personal' | 'Organization';
  organizationName: string | null;
  role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'OPERATOR';
  SubscriptionPlan: 'Free' | 'Starter' | 'Growth' | 'Experience';
  isVerified: boolean;
  agentCreationToken?: number; // Tracks available forge credits
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkForAuth = async () => {
      try {
        // Triggers secure fetch using credentials: "include"
        const data = await getCurrentUser();
        
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error: any) {
        // ✅ FIXED: Catches 401 unauthenticated errors and safely flushes state
        console.warn("[AgentForge Auth Context] Handshake failed or session expired:", error.message);
        setUser(null);
      } finally {
        // ✅ FIXED: Guarantees loading spinner turns off, dropping the loading screen trap
        setLoading(false);
      }
    };

    checkForAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};