import React, { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import { useFundWallet } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const FaBell = require("react-icons/fa").FaBell;
import { useStablePay } from "../context/StablePayContext";

const Dashboard = () => {
  const router = useRouter();
  const { fundWallet } = useFundWallet();
  const { wallets } = useWallets();
  const [walletAddress, setWalletAddress] = useState("Loading...");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { isDeveloperTheme, toggleTheme, setUserWallets } = useStablePay();
  const { ready, authenticated, logout } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    setWalletAddress(wallets[0]?.address || "Loading...");
    setUserWallets(wallets); // Store wallets in context
    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(storedNotifications);
  }, [wallets, setUserWallets]);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.container} ${isDeveloperTheme ? styles.greenTheme : ""}`}>
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
                <input type="checkbox" checked={isDeveloperTheme} onChange={toggleTheme} />
                <span className={styles.slider}></span>
              </label>
              <button className={styles.logoutButton} onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <h1 className={styles.welcomeText}>StablePay</h1>
          <h3 className={styles.welcomeTextW}>Welcome</h3>

          <div className={styles.walletContainer}>
            <p className={styles.walletAddress}>
              <span className={styles.addressText}>
                {walletAddress}
                <button className={styles.copyButton} onClick={handleCopyWallet}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </span>
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={() => router.push("/profile")}
              className={styles.navButton}
            >
              Profile
            </button>
            <button onClick={() => fundWallet(wallets[0]!.address)} className={styles.navButton}>
              Fund Wallet
            </button>
            <button onClick={() => router.push("/friend")} className={styles.navButton}>
              Friends
            </button>
            <button
              onClick={() => router.push("/solopay")}
              className={styles.navButton}
            >
              Solo Payment
            </button>
            <button
              onClick={() => router.push("/splitpay")}
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
