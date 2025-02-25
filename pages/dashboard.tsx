import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/dashboard.module.css";

const Dashboard = () => {
  const router = useRouter();
  const [walletAddress] = useState("0x1234...abcd"); // Placeholder wallet address
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleDeleteNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      {/* Notification Button */}
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
        <button onClick={() => router.push("/fund-wallet")} className={styles.navButton}>Fund Wallet</button>
        <button onClick={() => router.push("/friend")} className={styles.navButton}>Friend Profile</button>
        <button onClick={() => router.push("/solopay")} className={styles.navButton}>Solo Payment</button>
        <button onClick={() => router.push("/splitpay")} className={styles.navButton}>Split Payment</button>
      </div>
    </div>
  );
};

export default Dashboard;
