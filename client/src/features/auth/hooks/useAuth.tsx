import { useContext } from "react";
import {
  login, logout, requestRegistrationOTP, verifyAndRegister,
  requestPasswordResetOTP, verifyPasswordResetOTP, resetPassword
} from "../services/api.tsx";
import { AuthContext } from "../authContext.tsx";
import { useGlobalNavigate } from "../../../hooks/NavigationProvider.tsx";

export const useAuth = () => {
  const navigate = useGlobalNavigate();
  const context = useContext(AuthContext) as any;

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, loading, setLoading } = context;

  // ✧ STEP 1: Request Registration OTP
  const requestOTP = async ({ username, email }: { username: string; email: string }) => {
    setLoading(true);
    try {
      await requestRegistrationOTP({ username, email });
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // ✧ STEP 2: Final Registration Commit
  const handleVerifyAndRegister = async (payload: any) => {
    setLoading(true);
    try {
      const data = await verifyAndRegister(payload);
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: "Registration handshake failed" };
    } catch (err: any) {
      console.error("Registration error:", err);
      return { success: false, message: err.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN OPERATIONS
  const handleLogin = async ({ userId, password }: any) => {
    setLoading(true);
    try {
      const data = await login({ userId, password });
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, message: error.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT OPERATIONS
  const handleLogout = async () => {
    setLoading(true); // Turn on spinner during network termination handshake
    try {
      await logout();
      setUser(null);
      navigate("/login");
      return { success: true };
    } catch (error: any) {
      console.error("Logout runtime error:", error);
      return { success: false, message: error.message || "Failed to gracefully clear session" };
    } finally {
      setLoading(false);
    }
  };

  // ✧ REQUEST RESET OTP
  const requestResetOTP = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await requestPasswordResetOTP(email);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // ✧ VERIFY RESET OTP
  const verifyResetOTP = async ({ email, otp }: { email: string; otp: string }) => {
    setLoading(true);
    try {
      await verifyPasswordResetOTP(email, otp);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  // ✧ RESET PASSWORD FINALIZATION
  const handleResetPassword = async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      await resetPassword(payload);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    requestOTP,
    verifyAndRegister: handleVerifyAndRegister,
    handleLogin,
    handleLogout,
    requestResetOTP,
    verifyResetOTP,
    resetPassword: handleResetPassword
  };
};