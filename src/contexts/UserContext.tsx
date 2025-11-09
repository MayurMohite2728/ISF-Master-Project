import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "officer" | "supervisor" | "admin" | "tech_approver" | null;
type User = {
  username: string;
  role: Role;
  fullName: string;
} | null;

interface UserContextType {
  user: User;
  login: (username: string, role: Role, fullName: string) => void;
  logout: () => void;
  switchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (username: string, role: Role, fullName: string) => {
    setUser({ username, role, fullName });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const switchUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, switchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

