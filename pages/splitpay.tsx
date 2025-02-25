import React, { useState } from "react";
import { friends as initialFriends } from "../data/friend";
import styles from "../styles/splitpay.module.css";

const SplitPay = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("Chain 1");
  const [showDropdown, setShowDropdown] = useState(false);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [friends] = useState(initialFriends);
  const [includeMe, setIncludeMe] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddAddress = () => {
    if (!address) return;
    if (editingIndex !== null) {
      const updatedList = [...addressList];
      updatedList[editingIndex] = address;
      setAddressList(updatedList);
      setEditingIndex(null);
    } else {
      setAddressList([...addressList, address]);
    }
    setAddress("");
  };

  const handleEditAddress = (index: number) => {
    setAddress(addressList[index] ?? "");
    setEditingIndex(index);
  };

  const handleAddFriend = (friendAddress: string) => {
    if (!addressList.includes(friendAddress)) {
      setAddressList([...addressList, friendAddress]);
    }
  };

  const handlePay = () => {
    alert(`Paying ${amount} to ${includeMe ? "Me + " : ""}${addressList.join(", ")} on ${selectedChain}`);
  };

  return (
    <div className={styles.container}>
      <h2>Split Payment</h2>
      <div className={styles.toggleContainer}>
        <button onClick={() => setIncludeMe(true)} className={includeMe ? styles.activeButton : styles.toggleButton}>Include Me</button>
        <button onClick={() => setIncludeMe(false)} className={!includeMe ? styles.activeButton : styles.toggleButton}>Exclude Me</button>
      </div>
      <input
        type="text"
        placeholder="Enter recipient address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleAddAddress} className={styles.addButton}>{editingIndex !== null ? "Update" : "Add"}</button>
      <ul className={styles.addressList}>
        {addressList.map((addr, index) => (
          <li key={index} className={styles.addressItem}>
            {addr} <button onClick={() => handleEditAddress(index)}>Edit</button>
          </li>
        ))}
      </ul>
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
      <h3>Friends List</h3>
      <ul className={styles.friendList}>
        {friends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            {friend.name} - {friend.walletAddress} <button onClick={() => handleAddFriend(friend.walletAddress)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SplitPay;
