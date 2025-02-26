import React, { useState, useEffect } from "react";

import styles from "../styles/dashboard.module.css";
import {useFundWallet} from '@privy-io/react-auth';
import { useRouter } from "next/router";

import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
      
const FaBell = require("react-icons/fa").FaBell;


const Dashboard = () => {
  const router = useRouter();
  const {fundWallet} = useFundWallet();
  const {wallets} = useWallets();
  const [walletAddress, setWalletAddress] = useState("...");  
  const [notifications, setNotifications] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGreenTheme, setIsGreenTheme] = useState(false);

const {ready, authenticated, logout} = usePrivy();


  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);
  


  useEffect(() => {
    setWalletAddress(wallets[0]?.address || "...");
    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(storedNotifications);
  }, [wallets]);
  
    
  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.container} ${isGreenTheme ? styles.greenTheme : ""}`}>
      {ready && authenticated ? (
        <div>
          <div className="flex flex-row justify-between">
            <div className={styles.topRightContainer}>
              <button className={styles.notificationButton} onClick={() => router.push("/notification")}>
                <FaBell />
                {notifications.length > 0 && <span className={styles.redDot}></span>}
              </button>
            
            </div>
  
            <div className={styles.notificationContainer}>
            
              <label className={styles.toggleSwitch}>
                <input type="checkbox" onChange={() => setIsGreenTheme(!isGreenTheme)} />
                <span className={styles.slider}></span>
              </label>
              <button className={styles.logoutButton} onClick={logout}>Logout</button>
            </div>
          </div>
  
          <h1 className={styles.welcomeText}>Welcome to StablePay</h1>
  
          <div className={styles.walletContainer}>
            <p className={styles.walletAddress}>
              Wallet:
              <span className={styles.addressText}>
                {walletAddress}
                <button className={styles.copyButton} onClick={handleCopyWallet}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </span>
            </p>
          </div>
  
  
          <div className={styles.buttonContainer}>
            <button onClick={() => fundWallet(wallets[0]!.address)} className={styles.navButton}>
              Fund Wallet
            </button>
            <button onClick={() => router.push("/friend")} className={styles.navButton}>
              Friends
            </button>
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
      ) : null}
    </div>
  );
  
};

export default Dashboard;
