import React, { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import {useFundWallet} from '@privy-io/react-auth';
import { useRouter } from "next/router";

import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";


const Dashboard = () => {
  const router = useRouter();
  const {fundWallet} = useFundWallet();
  const {wallets} = useWallets();
  const [walletAddress, setWalletAddress] = useState("..."); // Placeholder wallet address
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

const {ready, authenticated, logout} = usePrivy();


  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);
  


  useEffect(() => {
    setWalletAddress(wallets[0]?.address || "...");
  }, [wallets]);
  


  const handleDeleteNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
              {ready && authenticated ? (
    <div> 
    <div className="flex flex-row justify-between">
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>
            </div>


      <div className={styles.notificationContainer}>
        <button className={styles.notificationButton} onClick={() => setShowNotifications(!showNotifications)}>
          Notifications {notifications.length > 0 && <span className={styles.redDot}></span>}
        </button>
        {showNotifications && (
          <div className={styles.notificationPopup}>
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <div key={index} className={styles.notification}>
                  <span>{note}</span>
                  <button onClick={() => handleDeleteNotification(index)}>X</button>
                </div>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        )}
      </div>
      
      {/* Welcome Section */}
      <h1 className={styles.welcomeText}>Welcome to StablePay</h1>
      <p className={styles.walletAddress}>Wallet: {walletAddress}</p>
      
      {/* Navigation Buttons */}
      <div className={styles.buttonContainer}>
        <button onClick={()=>fundWallet(wallets[0]!.address)} className={styles.navButton}>Fund Wallet</button>
        <button onClick={() => router.push("/friend")} className={styles.navButton}>Friend Profile</button>


        <button
  onClick={() => router.push({ pathname: "/solopay", query: { wallets: JSON.stringify(wallets) } })}
  className={styles.navButton}
>
  Solo Payment
</button>
<button
  onClick={() => router.push({ pathname: "/splitpay", query: { wallets: JSON.stringify(wallets) } })}
  className={styles.navButton}
>
  Split Payment
</button>


      </div>
      </div>
    ):null}
    </div>
  );
};

export default Dashboard;
