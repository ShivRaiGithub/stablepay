import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import { usePrivy, ConnectedWallet } from "@privy-io/react-auth";
import { useStablePay } from "../context/StablePayContext";
const { FaArrowLeft } = require("react-icons/fa");
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const { getUserWallets } = useStablePay();
  const {
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    user,
  } = usePrivy();

  useEffect(() => {
    setWallets(getUserWallets());
  }, [getUserWallets]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Profile</h2>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <FaArrowLeft />
          </button>
        </div>
        <div className={styles.walletSection}>
          <span className={styles.walletText}>
            {wallets[0]?.address || "Loading..."}
          </span>
        </div>

        <div className={styles.buttonContainer}>
          <div className="mt-12 flex gap-4 flex-wrap">
            {googleSubject ? (
              <button
                onClick={() => unlinkGoogle(googleSubject)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Google
              </button>
            ) : (
              <button
                onClick={linkGoogle}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Link Google
              </button>
            )}

            {twitterSubject ? (
              <button
                onClick={() => unlinkTwitter(twitterSubject)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Twitter
              </button>
            ) : (
              <button
                onClick={linkTwitter}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Link Twitter
              </button>
            )}

            {discordSubject ? (
              <button
                onClick={() => unlinkDiscord(discordSubject)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Discord
              </button>
            ) : (
              <button
                onClick={linkDiscord}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Link Discord
              </button>
            )}

            {email ? (
              <button
                onClick={() => unlinkEmail(email.address)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Email
              </button>
            ) : (
              <button
                onClick={linkEmail}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Connect Email
              </button>
            )}

            {wallet ? (
              <button
                onClick={() => unlinkWallet(wallet.address)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Wallet
              </button>
            ) : (
              <button
                onClick={linkWallet}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Connect Wallet
              </button>
            )}

            {phone ? (
              <button
                onClick={() => unlinkPhone(phone.number)}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
                disabled={!canRemoveAccount}
              >
                Unlink Phone
              </button>
            ) : (
              <button
                onClick={linkPhone}
                className="text-sm py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: "#0af" }}
              >
                Connect Phone
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
