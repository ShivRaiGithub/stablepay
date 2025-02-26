import React, { useState } from "react";
import styles from "../styles/notification.module.css";
import { useRouter } from "next/router";
const FaArrowLeft = require("react-icons/fa").FaArrowLeft;

const NotificationPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    "Payment received from John",
    "New transaction alert",
    "Reminder: Split Payment pending"
  ]);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([])); // Persist across refreshes
  };

  const deleteNotification = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
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
              {notif}
              <button className={styles.deleteButton} onClick={() => deleteNotification(index)}>Delete</button>
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
