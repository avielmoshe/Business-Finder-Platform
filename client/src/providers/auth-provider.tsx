import { Role } from "@/utils/api"; // Removed `User` import since it's unused
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

export interface UserFromToken {
  id: string;
  username: string;
  email: string;
  role: Role | undefined;
  plan: "Standard" | "Gold" | "Platinum";
}

interface AuthContextType {
  user: UserFromToken | null;
  setUser: React.Dispatch<React.SetStateAction<UserFromToken | null>> | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserFromToken | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
