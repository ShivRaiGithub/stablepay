import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/solopay.module.css";
const { FaArrowLeft } = require("react-icons/fa");

const SoloPay = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("Select Chain");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNet, setSelectedNet] = useState("Select Net ");
  const [isGreenTheme, setIsGreenTheme] = useState(false);

  useEffect(() => {
    const themeState = localStorage.getItem("greenTheme");
    setIsGreenTheme(themeState === "true");
  }, []);

  const handleToggle = () => {
    const newThemeState = !isGreenTheme;
    setIsGreenTheme(newThemeState);
    localStorage.setItem("greenTheme", newThemeState.toString());
  };

  return (
    <div className={`${styles.container} ${isGreenTheme ? styles.greenTheme : ""}`}>
      {/* Top Bar with Back Button and Toggle */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={isGreenTheme} onChange={handleToggle} />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Centered Solo Payment UI */}
      <div className={styles.content}>
        <h2 className={`${styles.title} ${isGreenTheme ? styles.greenText : ""}`}>Solo Payment</h2>
        <input
          type="text"
          placeholder="Enter recipient address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
        />
        <input
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttonContainer}>
          <button className={`${styles.payButton} ${isGreenTheme ? styles.greenButton : ""}`}>Pay</button>
          <div className={styles.dropdownContainer}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`${styles.chainButton} ${isGreenTheme ? styles.greenButton : ""}`}
            >
              {selectedChain} ▼
            </button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                {["Chain 1", "Chain 2", "Chain 3"].map((chain) => (
                  <div
                    key={chain}
                    onClick={() => {
                      setSelectedChain(chain);
                      setShowDropdown(false);
                    }}
                  >
                    {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
          {isGreenTheme && (
            <select className={styles.selectNet} onChange={(e) => setSelectedNet(e.target.value)}>
              <option value="net1">Net 1</option>
              <option value="net2">Net 2</option>
              <option value="net3">Net 3</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoloPay;
