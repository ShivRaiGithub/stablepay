import React, { useEffect } from "react";
import styles from "../styles/notification.module.css";
import { useRouter } from "next/router";
const { FaArrowLeft } = require("react-icons/fa");
import { useStablePay } from "../context/StablePayContext";

const NotificationPage = () => {
  const router = useRouter();
  const { notifications, getNotifications, setNotifications } = useStablePay();

  useEffect(() => {
    getNotifications(); // Fetch notifications on component mount
    console.log("Notifications fetched");
  }, []);

  const clearNotifications = async () => {
    await setNotifications([]); // Update backend and local state
  };

  const deleteNotification = async (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    await setNotifications(updatedNotifications);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft size={20} />
        </button>
        <h2 className={styles.title}>Notifications</h2>
      </div>
      <div className={styles.notificationsList}>
      {notifications.length > 0 ? (
  notifications.map((notif, index) => (
    <div key={index} className={styles.notificationItem}>
      {notif.title}  {/* Access the title property */}
      <button
        className={styles.deleteButton}
        onClick={() => deleteNotification(index)}
      >
        Delete
      </button>
    </div>
  ))
) : (
  <p className={styles.emptyMessage}>No new notifications</p>
)}

      </div>
      {notifications.length > 0 && (
        <button className={styles.clearButton} onClick={clearNotifications}>
          Clear All
        </button>
      )}
    </div>
  );
};

export default NotificationPage;