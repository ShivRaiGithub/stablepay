import React, { useState } from "react";
import styles from "../styles/profile.module.css";

const Profile = () => {
  const [walletAddress] = useState("0xAbcD1234EfGh5678IjKl90MnOpQrStUvWxYz");
  const [isWalletVisible, setIsWalletVisible] = useState(true);

  const toggleWalletVisibility = () => {
    setIsWalletVisible(!isWalletVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Profile</h2>
        
        <div className={styles.walletSection}>
          <span className={styles.walletText}>
            {isWalletVisible ? walletAddress : "••••••••••••••••••••••••"}
          </span>
          <button className={styles.toggleButton} onClick={toggleWalletVisibility}>
            {isWalletVisible ? "Hide" : "Show"}
          </button>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.actionButton}>Link Google</button>
          <button className={styles.actionButton}>Link Twitter</button>
          <button className={styles.actionButton}>Link Discord</button>
          <button className={styles.actionButton}>Link Email</button>
          <button className={styles.actionButton}>Link Wallet</button>
          <button className={styles.actionButton}>Connect Phone</button>
          <button className={styles.actionButton}>Verify Token on Server</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
