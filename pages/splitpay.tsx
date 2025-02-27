import React, { useState, useEffect } from "react";
import styles from "../styles/splitpay.module.css";
import { useRouter } from "next/router";
const FaArrowLeft = require("react-icons/fa").FaArrowLeft;
import { chains } from "../data/constants"; // Import the chains data
import { useDeveloperTheme } from "../context/DeveloperThemeContext";

import { ConnectedWallet } from "@privy-io/react-auth";


const SplitPay = () => {
  const router = useRouter();
  const { isDeveloperTheme } = useDeveloperTheme();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [contributor, setContributor] = useState(""); // Separate contributor input state
  const [addresses, setAddresses] = useState<{ id: number; address: string }[]>([]);
  const [friends, setFriends] = useState([
    { name: "John Doe", address: "0xAbC123456789Ef123456789AbCdEf1234567890" },
    { name: "Jane Smith", address: "0xDef456789AbCdEf123456789AbCdEf123456789C1" },
    { name: "Alice Johnson", address: "0x123AbCdEf456789dEf123456789AbCdEf1234567" },
  ]);
  const [selectedNet, setSelectedNet] = useState(isDeveloperTheme ? "Testnet" : "Mainnet");
  const [selectedChain, setSelectedChain] = useState("");
  const [includeMe, setIncludeMe] = useState(1); // 1 for Include Me, 0 for Exclude Me
 
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);


  useEffect(() => {
    setSelectedChain(Object.keys(chains[selectedNet])[0] || "Select Chain"); // Set first chain
  }, [selectedNet]);


    useEffect(() => {
      if (router.query.wallets) {
        setWallets(JSON.parse(router.query.wallets as string));
      }
    }, [router.query.wallets]);
  

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
    }
  };

  const handleAddContributor = () => {
    if (contributor.trim() !== "") {
      setAddresses([...addresses, { id: Date.now(), address: contributor }]);
      setContributor("");
    }
  };

  return (
    <div className={`${styles.container} ${isDeveloperTheme ? styles.darkTheme : ""}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={`${styles.backButton} ${isDeveloperTheme ? styles.greenButton : ""}`} onClick={() => router.back()}>
          <FaArrowLeft size={24} />
        </button>

      </div>

      <h1 className={`${styles.title} ${isDeveloperTheme ? styles.greenText : ""}`}>Split Payment</h1>
      <div className={styles.toggleButtons}>
        <button
          className={`${styles.includeButton} ${includeMe === 1 ? styles.selected : ""}`}
          onClick={() => setIncludeMe(1)}
        >
          Include Me
        </button>
        <button
          className={`${styles.excludeButton} ${includeMe === 0 ? styles.selected : ""}`}
          onClick={() => setIncludeMe(0)}
        >
          Exclude Me
        </button>
      </div>


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
        value={contributor}
        onChange={(e) => setContributor(e.target.value)}
      />
      <button className={`${styles.addButton} ${isDeveloperTheme ? styles.greenButton : ""}`} onClick={handleAddContributor}>
        Add Contributor
      </button>

      {/* Pay & Network Selection */}
      <div className={styles.paymentControls}>
        <button className={`${styles.payButton} ${isDeveloperTheme ? styles.greenButton : ""}`}>Pay</button>

        {/* Chain Selection Dropdown */}
        <select className={styles.chainSelect} value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}>
          {Object.keys(chains[selectedNet]).map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ))}
        </select>
      </div>

      {/* Added Addresses List */}
      {addresses.length > 0 && (
        <div className={styles.addressList}>
          {addresses.map((addr) => (
            <div key={addr.id} className={styles.addressItem}>
              <span>{addr.address}</span>
              <button className={`${styles.deleteButton} ${isDeveloperTheme ? styles.greenButton : ""}`} onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
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
              className={`${styles.addFriendButton} ${isDeveloperTheme ? styles.greenButton : ""}`}
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
