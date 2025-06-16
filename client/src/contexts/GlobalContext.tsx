import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { accessTokenKey, loggedUserKey, refreshTokenKey } from "../consts";

interface User {
  id: string;
  name: string;
  email?: string;
  companyId: number;
  userLevel: number;
  groupId: number;
  groupName: string;
  firstLogin: boolean;
  firstName?: string;
  lastName?: string;
}

interface GlobalContextType {
  connectedUser: User | null;
  setConnectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateConnectedUser: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;
  resetConnectedUser: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [connectedUser, setConnectedUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(loggedUserKey);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const updateConnectedUser = useCallback(
    (user: User, accessToken: string, refreshToken: string) => {
      setConnectedUser(user);
      localStorage.setItem(accessTokenKey, accessToken);
      localStorage.setItem(refreshTokenKey, refreshToken);
      localStorage.setItem(loggedUserKey, JSON.stringify(user));
    },
    []
  );

  const resetConnectedUser = useCallback(() => {
    setConnectedUser(null);
    localStorage.removeItem(loggedUserKey);
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        connectedUser,
        setConnectedUser,
        updateConnectedUser,
        resetConnectedUser,
      }}>
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
