import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/index.module.css";

const IndexPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>StablePay</h1>
        <p className={styles.subtitle}>Fast and Secure Transactions for Everyone</p>
        <button onClick={handleLogin} className={styles.loginButton}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
