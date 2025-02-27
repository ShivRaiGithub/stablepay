import { createContext, useContext, useState, ReactNode } from "react";
import { ConnectedWallet } from "@privy-io/react-auth";
import { friends as initialFriends, notifications as initialNotifications } from "../data/constants";

type StablePayContextType = {
  isDeveloperTheme: boolean;
  toggleTheme: () => void;
  wallets: ConnectedWallet[];
  getUserWallets: () => ConnectedWallet[];
  setUserWallets: (wallets: ConnectedWallet[]) => void;
  friends: { name: string; address: string }[];
  getFriends: () => { name: string; address: string }[];
  setFriends: (friends: { name: string; address: string }[]) => void;
  notifications: string[];
  getNotifications: () => string[];
  setNotifications: (notifications: string[]) => void;
};

const StablePayContext = createContext<StablePayContextType | null>(null);

interface StablePayProviderProps {
  children: ReactNode;
}

export const StablePayProvider = ({ children }: StablePayProviderProps) => {
  const [isDeveloperTheme, setIsDeveloperTheme] = useState(false);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [friends, setFriends] = useState(initialFriends);
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleTheme = () => {
    setIsDeveloperTheme((prev) => !prev);
  };

  const getUserWallets = () => wallets;
  const setUserWallets = (wallets: ConnectedWallet[]) => setWallets(wallets);
  const getFriends = () => friends;
  const getNotifications = () => notifications;

  return (
    <StablePayContext.Provider
      value={{
        isDeveloperTheme,
        toggleTheme,
        wallets,
        getUserWallets,
        setUserWallets,
        friends,
        getFriends,
        setFriends,
        notifications,
        getNotifications,
        setNotifications,
      }}
    >
      {children}
    </StablePayContext.Provider>
  );
};

export const useStablePay = (): StablePayContextType => {
  const context = useContext(StablePayContext);

  if (!context) {
    throw new Error("useStablePay must be used within a StablePayProvider");
  }

  return context;
};
