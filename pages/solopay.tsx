import React, { useState } from "react";
import styles from "../styles/solopay.module.css";

const SoloPay = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("Chain 1");
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePay = () => {
    alert(`Paying ${amount} to ${address} on ${selectedChain}`);
  };

  return (
    <div className={styles.container}>
      <h2>Solo Payment</h2>
      <input
        type="text"
        placeholder="Enter recipient address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <div className={styles.buttonContainer}>
        <button onClick={handlePay} className={styles.payButton}>Pay</button>
        <div className={styles.dropdownContainer}>
          <button onClick={() => setShowDropdown(!showDropdown)} className={styles.chainButton}>
            {selectedChain} ▼
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              {["Chain 1", "Chain 2", "Chain 3"].map((chain) => (
                <div key={chain} onClick={() => { setSelectedChain(chain); setShowDropdown(false); }}>
                  {chain}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoloPay;
