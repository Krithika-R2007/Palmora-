import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "customer" | "owner" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextType>({ role: "customer", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("customer");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
