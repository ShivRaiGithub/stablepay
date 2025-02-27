import React, { useState, useEffect } from "react";
import styles from "../styles/friend.module.css";
import { useRouter } from "next/router";
const FaArrowLeft = require("react-icons/fa").FaArrowLeft;
import { useStablePay } from "../context/StablePayContext";

const Friend = () => {
  const router = useRouter();  
  const { getFriends, setFriends } = useStablePay();
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [editWalletAddress, setEditWalletAddress] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [friends, setFriendsState] = useState<{ name: string; address: string }[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const newFriends = await getFriends(); // Fetch friends
      setFriendsState(newFriends); // Update local state
    };
  
    fetchFriends();
  }, []);
  

  const handleAddFriend = async () => {
    if (!name || !walletAddress) {
      alert("Please enter both Name and Wallet Address.");
      return;
    }

    const newFriend = { name, address: walletAddress };

    try {
      const updatedFriends = [...friends, newFriend];
      await setFriends(updatedFriends); // Update on server
      setFriendsState(updatedFriends); // Update local state
      setNotifications([...notifications, `Friend ${name} added successfully!`]);
      setName("");
      setWalletAddress("");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleEditFriend = (walletAddress: string) => {
    const friendToEdit = friends.find(friend => friend.address === walletAddress);
    if (!friendToEdit) return;
    setEditWalletAddress(walletAddress);
    setName(friendToEdit.name);
    setWalletAddress(friendToEdit.address);
  };

  const handleUpdateFriend = async () => {
    if (!editWalletAddress) return;

    const updatedFriends = friends.map(friend =>
      friend.address === editWalletAddress ? { ...friend, name, address: walletAddress } : friend
    );

    try {
      await setFriends(updatedFriends); // Update on server
      setFriendsState(updatedFriends); // Update local state
      setNotifications([...notifications, `Friend ${name} updated!`]);
      setEditWalletAddress(null);
      setName("");
      setWalletAddress("");
    } catch (error) {
      console.error("Error updating friend:", error);
    }
  };

  const handleDeleteFriend = async (walletAddress: string) => {
    const deletedFriend = friends.find(friend => friend.address === walletAddress);
    if (!deletedFriend) return;

    const updatedFriends = friends.filter(friend => friend.address !== walletAddress);

    try {
      await setFriends(updatedFriends); // Update on server
      setFriendsState(updatedFriends); // Update local state
      setNotifications([...notifications, `Friend ${deletedFriend.name} removed!`]);
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  // const handleDeleteNotification = (index: number) => {
  //   const updatedNotifications = notifications.filter((_, i) => i !== index);
  //   setNotifications(updatedNotifications);
  // };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
      </div>
{/* 
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
      )} */}
      
      <h2>{editWalletAddress !== null ? "Edit Friend" : "Add Friend"}</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={styles.inputField} />
      <input type="text" placeholder="Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className={styles.inputField} />
      {editWalletAddress !== null ? (
        <div>
          <br/>
          <button className={styles.actionButtonAddUpdate} onClick={handleUpdateFriend}>Update</button>
        </div>
      ) : (
        <div>
          <br/>
          <button className={styles.actionButtonAddUpdate} onClick={handleAddFriend}>Add</button>
        </div>
      )}
      
      <h2>Friends List</h2>
      <div className={styles.friendsList}>
        {friends.map(friend => (
          <div key={friend.address} className={styles.friendCard}>
            <button className={styles.payButton} onClick={() => router.push(`/solopay?recipient=${friend.address}`)}>Pay</button>
            <span className={styles.friendName}>{friend.name}</span>
            <span className={styles.friendAddress}>{friend.address}</span>
            <button className={styles.actionButton} onClick={() => handleEditFriend(friend.address)}>Edit</button>
            <button className={styles.actionButton} onClick={() => handleDeleteFriend(friend.address)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Friend;
