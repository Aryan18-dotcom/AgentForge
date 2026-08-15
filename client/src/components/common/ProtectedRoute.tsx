import React from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation(); // 👈 FIXED: Instantiated location hook context

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131d] flex items-center justify-center font-mono text-xs text-[#4cd7f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-2 border-[#7c3aed]/30 border-t-[#4cd7f6] rounded-full animate-spin" />
          <span className="ai-status-pulse">Verifying Security Token...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}