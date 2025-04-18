import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  companyId: string;
}

interface GlobalContextType {
  connectedUser: User | null;
  setConnectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  return (
    <GlobalContext.Provider value={{ connectedUser, setConnectedUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
