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
      <button onClick={handleLogin} className={styles.loginButton}>
        Log in
      </button>
    </div>
  );
};

export default IndexPage;
