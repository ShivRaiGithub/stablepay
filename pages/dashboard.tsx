import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/dashboard.module.css";
const FaBell = require("react-icons/fa").FaBell;

const Dashboard = () => {
  const router = useRouter();
  const [walletAddress] = useState("0xAbC123456789dEf123456789AbCdEf1234567890"); // Placeholder wallet address
  const [notifications, setNotifications] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGreenTheme, setIsGreenTheme] = useState(false);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(storedNotifications);
  }, []);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className={`${styles.container} ${isGreenTheme ? styles.greenTheme : ""}`}>
      {/* Top Right - Bell Icon, Toggle Button, and Logout */}
      <div className={styles.topRightContainer}>
        <button className={styles.notificationButton} onClick={() => router.push("/notification")}>
          <FaBell />
          {notifications.length > 0 && <span className={styles.redDot}></span>}
        </button>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" onChange={() => setIsGreenTheme(!isGreenTheme)} />
          <span className={styles.slider}></span>
        </label>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <h1 className={styles.welcomeText}>Welcome to StablePay</h1>
      <div className={styles.walletContainer}>
        <p className={styles.walletAddress}>
          Wallet:<span className={styles.addressText}>{walletAddress}
          <button className={styles.copyButton} onClick={handleCopyWallet}>
            {copied ? "Copied!" : "Copy"}
          </button>
          </span>
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push("/fund-wallet")} className={styles.navButton}>Fund Wallet</button>
        <button onClick={() => router.push("/friend")} className={styles.navButton}>Friend Profile</button>
        <button onClick={() => router.push("/solopay")} className={styles.navButton}>Solo Payment</button>
        <button onClick={() => router.push("/splitpay")} className={styles.navButton}>Split Payment</button>
      </div>
    </div>
  );
};

export default Dashboard;
