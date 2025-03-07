import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ConnectedWallet } from "@privy-io/react-auth";

type StablePayContextType = {
  isDeveloperTheme: boolean;
  toggleTheme: () => void;
  wallets: ConnectedWallet[];
  getUserWallets: () => ConnectedWallet[];
  setUserWallets: (wallets: ConnectedWallet[]) => void;
  friends: { name: string; address: string }[];
  getFriends: () => Promise<void>;
  setFriends: (friends: { name: string; address: string }[]) => Promise<void>;
  notifications: string[];
  getNotifications: () => Promise<void>;
  setNotifications: (notifications: string[]) => Promise<void>;
  sendNotifications: (address:string, notification: string) => Promise<void>;
};

const StablePayContext = createContext<StablePayContextType | null>(null);

interface StablePayProviderProps {
  children: ReactNode;
}

export const StablePayProvider = ({ children }: StablePayProviderProps) => {
  const [isDeveloperTheme, setIsDeveloperTheme] = useState(false);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [friends, setFriendsState] = useState();
  const [notifications, setNotificationsState] = useState<string[]>([]);

  useEffect(() => {
    if (walletAddress) {
      exist(walletAddress);
      getFriends();
      getNotifications();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (wallets) {
      setWalletAddress(wallets[0]?.address || "");
    }
  }, [wallets]);

  const toggleTheme = () => {
    setIsDeveloperTheme((prev) => !prev);
  };

  const getUserWallets = () => wallets;

  
  const setUserWallets = (walletss: ConnectedWallet[]) => {setWallets(walletss);}

  const exist = async (walletAddress: string) => {
    try {
      const response = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${walletAddress}`
      );
  
      if (response.ok) {
        console.log("User already exists.");
        return;
      }
  
      if (response.status === 404) {
        const createResponse = await fetch(
          "https://stablepay-backend.onrender.com/api/users/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: walletAddress,
              friends: [],
              notification: [],
            }),
          }
        );
  
        if (!createResponse.ok) {
          throw new Error("Failed to create user.");
        }
  
        console.log("User created successfully.");
      } else {
        throw new Error("Error checking user existence.");
      }
    } catch (error) {
      console.error("Error in exist function:", error);
    }
  };

  const getFriends = async () => {
    if (!walletAddress) return [];
  
    try {
      console.log("Wallet address is", walletAddress);
      const response = await fetch(`https://stablepay-backend.onrender.com/api/users/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch friends");
  
      const data = await response.json();
      setFriendsState(data.friends || []);
      return data.friends || [];
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  };
  

  const setFriends = async (friends: { name: string; address: string }[]) => {
    if (!walletAddress) return;

    try {
      const response = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${walletAddress}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friends }),
        }
      );
      if (!response.ok) throw new Error("Failed to update friends");

      setFriendsState(friends);
    } catch (error) {
      console.error("Error updating friends:", error);
    }
  };

  const getNotifications = async () => {
    if (!walletAddress) return;

    try {
      const response = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${walletAddress}`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotificationsState(data.notification || []);
      
      console.log(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const setNotifications = async (notifications: string[]) => {
    if (!walletAddress) return;

    try {
      const response = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${walletAddress}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notification: notifications }),
        }
      );
      if (!response.ok) throw new Error("Failed to update notifications");

      setNotificationsState(notifications);
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  const sendNotifications = async (address: string, notification: string) => {
    if (!address) return;
    console.log("in sendNotifications");
    exist(address);
    
    try {
      // First fetch the user data to get current notifications
      const userResponse = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${address}`
      );
      
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
    console.log("got data");
      
      const userData = await userResponse.json();
      
      // Get current notifications from user data
      const currentNotifications = Array.isArray(userData.notification) 
        ? userData.notification 
        : [];
      
      // Create a notification object that matches your schema
      const newNotification = { title: notification };
    console.log("titled");

      
      // Append the new notification at the top
      const updatedNotifications = [newNotification, ...currentNotifications];
      
      // Update the user with the new notifications
      const updateResponse = await fetch(
        `https://stablepay-backend.onrender.com/api/users/${address}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notification: updatedNotifications
          }),
        }
      );
      
      if (!updateResponse.ok) throw new Error("Failed to update notifications");
      
      // Update local state with the new list
      setNotificationsState(updatedNotifications);
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

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
        sendNotifications,
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
