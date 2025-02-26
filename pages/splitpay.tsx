import React, { useState, useEffect } from "react";
import styles from "../styles/splitpay.module.css";
import { useRouter } from "next/router";
const FaArrowLeft = require("react-icons/fa").FaArrowLeft;

const SplitPay = () => {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [addresses, setAddresses] = useState<{ id: number; address: string }[]>([]);
  const [friends, setFriends] = useState([
    { name: "John Doe", address: "0xAbC123456789Ef123456789AbCdEf1234567890" },
    { name: "Jane Smith", address: "0xDef456789AbCdEf123456789AbCdEf123456789C1" },
    { name: "Alice Johnson", address: "0x123AbCdEf456789dEf123456789AbCdEf1234567" },
  ]);
  const [selectedNet, setSelectedNet] = useState("Select Net");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const themeState = localStorage.getItem("darkTheme");
    setIsDarkTheme(themeState === "true");
  }, []);

  const handleToggle = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    localStorage.setItem("darkTheme", newThemeState.toString());
  };

  const handleAddAddress = () => {
    if (recipient.trim() !== "") {
      setAddresses([...addresses, { id: Date.now(), address: recipient }]);
      setRecipient("");
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleEditAddress = (id: number) => {
    const newAddress = prompt("Edit address:");
    if (newAddress) {
      setAddresses(addresses.map((addr) => (addr.id === id ? { ...addr, address: newAddress } : addr)));
    }
  };

  const handleAddFriend = (friend: { name: string; address: string }) => {
    if (!addresses.some((addr) => addr.address === friend.address)) {
      setAddresses([...addresses, { id: Date.now(), address: friend.address }]);
      setFriends(friends.filter((f) => f.address !== friend.address));
    }
  };

  return (
    <div className={`${styles.container} ${isDarkTheme ? styles.darkTheme : ""}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={`${styles.backButton} ${isDarkTheme ? styles.greenButton : ""}`} onClick={() => router.back()}>
          <FaArrowLeft size={24} />
        </button>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={isDarkTheme} onChange={handleToggle} />
          <span className={styles.slider}></span>
        </label>
      </div>
      <h1 className={`${styles.title} ${isDarkTheme ? styles.greenText : ""}`}>Split Payment</h1>
      <div className={styles.toggleButtons}>
        <button className={styles.includeButton}>Include Me</button>
        <button className={styles.excludeButton}>Exclude Me</button>
      </div>

      {/* Input Fields */}
      <input
        type="text"
        className={styles.input}
        placeholder="Enter recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        className={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        className={styles.input}
        placeholder="Contributor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className={`${styles.addButton} ${isDarkTheme ? styles.greenButton : ""}`} onClick={handleAddAddress}>
        Add
      </button>

      {/* Pay & Select Chain Buttons */}
      <div className={styles.paymentControls}>
        <button className={`${styles.payButton} ${isDarkTheme ? styles.greenButton : ""}`}>Pay</button>
        <select className={styles.chainSelect}>
          <option>Chain 1</option>
          <option>Chain 2</option>
          <option>Chain 3</option>
        </select>
        {isDarkTheme && (
          <select className={styles.selectNet} onChange={(e) => setSelectedNet(e.target.value)}>
            <option value="net1">Net 1</option>
            <option value="net2">Net 2</option>
            <option value="net3">Net 3</option>
          </select>
        )}
      </div>

      {/* Added Addresses List */}
      {addresses.length > 0 && (
        <div className={styles.addressList}>
          {addresses.map((addr) => (
            <div key={addr.id} className={styles.addressItem}>
              <span>{addr.address}</span>
              <button className={`${styles.editButton} ${isDarkTheme ? styles.greenButton : ""}`} onClick={() => handleEditAddress(addr.id)}>Edit</button>
              <button className={`${styles.deleteButton} ${isDarkTheme ? styles.greenButton : ""}`} onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <h2 className={styles.friendsTitle}>Friends List</h2>
      <div className={styles.friendsList}>
        {friends.map((friend, index) => (
          <div key={index} className={styles.friendItem}>
            <span>
              {friend.name} - {friend.address}
            </span>
            <button
              className={`${styles.addFriendButton} ${isDarkTheme ? styles.greenButton : ""}`}
              onClick={() => handleAddFriend(friend)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitPay;
