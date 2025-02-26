import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/index.module.css";


import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";



export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};



const IndexPage: React.FC = () => {
  const router = useRouter();

  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

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
