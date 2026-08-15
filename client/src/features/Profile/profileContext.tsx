import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useProfile } from "./hooks/useProfile";

type ProfileContextType = ReturnType<typeof useProfile>;

const ProfileContext =
  createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({
  children,
}: ProfileProviderProps) => {
  const profileState = useProfile();

  return (
    <ProfileContext.Provider value={profileState}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfileContext must be used within ProfileProvider"
    );
  }

  return context;
};