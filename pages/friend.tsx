import React, { useState } from "react";
import { friends as initialFriends } from "../data/friend";
import styles from "../styles/friend.module.css";
import { useRouter } from "next/router";
const FaArrowLeft = require("react-icons/fa").FaArrowLeft;
const FaBell = require("react-icons/fa").FaBell;

const Friend = () => {
  const router = useRouter();
  const [friends, setFriends] = useState(initialFriends);
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [payPopup, setPayPopup] = useState<number | null>(null);

  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications] = useState(false);

  const handleAddFriend = () => {
    if (!name || !walletAddress) return alert("Please enter both Name and Wallet Address.");

    const newFriend = { id: friends.length + 1, name, walletAddress };
    setFriends([newFriend, ...friends]);
    setNotifications([...notifications, `Friend ${name} added successfully!`]);
    setName("");
    setWalletAddress("");
  };

  const handleEditFriend = (id: number) => {
    const friendToEdit = friends.find(friend => friend.id === id);
    if (!friendToEdit) return;
    setEditId(id);
    setName(friendToEdit.name);
    setWalletAddress(friendToEdit.walletAddress);
  };

  const handleUpdateFriend = () => {
    if (editId === null) return;

    const updatedFriends = friends.map(friend =>
      friend.id === editId ? { ...friend, name, walletAddress } : friend
    );
    setFriends(updatedFriends);
    setNotifications([...notifications, `Friend ${name} updated!`]);
    setEditId(null);
    setName("");
    setWalletAddress("");
  };

  const handleDeleteFriend = (id: number) => {
    const deletedFriend = friends.find(friend => friend.id === id);
    if (!deletedFriend) return;

    setFriends(friends.filter(friend => friend.id !== id));
    setNotifications([...notifications, `Friend ${deletedFriend.name} removed!`]);
  };

  const handleDeleteNotification = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
        <button className={styles.notificationButton} onClick={() => router.push("/notification")}>
          <FaBell /> {notifications.length > 0 && <span className={styles.redDot}></span>}
        </button>
      </div>

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
      
      <h2>{editId !== null ? "Edit Friend" : "Add Friend"}</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={styles.inputField} />
      <input type="text" placeholder="Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className={styles.inputField} />
      {editId !== null ? (
        <div>
            <br/>
            <button className={styles.actionButtonAddUpdate} onClick={handleUpdateFriend}>Update</button>
        </div>
        // <button className={styles.actionButton} onClick={handleUpdateFriend}>Update</button>
      ) : (
        <div>
            <br/>
            <button className={styles.actionButtonAddUpdate} onClick={handleAddFriend}>Add</button>
        </div>
      )}
      
      <h2>Friends List</h2>
      <div className={styles.friendsList}>
        {friends.map(friend => (
          <div key={friend.id} className={styles.friendCard}>
            <button className={styles.payButton} onClick={() => setPayPopup(friend.id)}>Pay</button>
            <span className={styles.friendName}>{friend.name}</span>
            <span className={styles.friendAddress}>{friend.walletAddress}</span>
            <button className={styles.actionButton} onClick={() => handleEditFriend(friend.id)}>Edit</button>
            <button className={styles.actionButton} onClick={() => handleDeleteFriend(friend.id)}>Delete</button>
          </div>
        ))}
      </div>

      {payPopup !== null && (
        <div className={styles.notificationPopup}>
          <p>Processing payment for {friends.find(friend => friend.id === payPopup)?.name}</p>
          <button className={styles.actionButton} onClick={() => setPayPopup(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Friend;
