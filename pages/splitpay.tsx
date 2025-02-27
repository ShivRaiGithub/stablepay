import React, { useState, useEffect } from "react";
import styles from "../styles/splitpay.module.css";
import { useRouter } from "next/router";
import { useStablePay } from "../context/StablePayContext";
import { ConnectedWallet } from "@privy-io/react-auth";
import { createWalletClient, custom, encodeFunctionData } from "viem";
import { USDC_APPROVE_ABI, chains } from "../data/constants";

const FaArrowLeft = require("react-icons/fa").FaArrowLeft;


const SplitPay = () => {
  const router = useRouter();
  const { isDeveloperTheme, getUserWallets, getFriends, sendNotifications } = useStablePay();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [contributor, setContributor] = useState(""); // Separate contributor input state
  const [addresses, setAddresses] = useState<{ id: number; address: string }[]>([]);
  const [friends, setFriends] = useState<{ name: string; address: string }[]>([]);
  const [selectedNet, setSelectedNet] = useState(isDeveloperTheme ? "Testnet" : "Mainnet");
  const [selectedChain, setSelectedChain] = useState("");
  const [includeMe, setIncludeMe] = useState(1);

  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);

  useEffect(() => {
    setSelectedChain(Object.keys(chains[selectedNet])[0] || "Select Chain");
  }, [selectedNet]);

  useEffect(() => {
    const fetchData = async () => {
      const wallets = await getUserWallets();
      const friends = await getFriends();
      
      setWallets(wallets);
      setFriends(friends);
    };
  
    fetchData().catch(console.error);
  }, []);
  


  const handleSendTransaction = async (recipient: string) => {
    const wallet = wallets[0];
    if (!wallet || !selectedChain) return;
  
    const chainData = chains[selectedNet][selectedChain];
    await wallet.switchChain(chainData.chain.id);
  
    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      chain: chainData.chain,
      transport: custom(provider),
    });
  
    try {
      await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: chainData.usdcAddress,
        chain: chainData.chain,
        data: encodeFunctionData({
          abi: USDC_APPROVE_ABI,
          functionName: "transfer",
          args: [recipient as `0x${string}`, BigInt(amount * 1000000)],
        }),
      });
  
      console.log("Transaction sent successfully!");
  
      // Calculate the split amount
      const contributors = addresses.map((addr) => addr.address);
      const totalContributors = includeMe ? contributors.length + 1 : contributors.length;

      if (totalContributors <= 0) return;
  
      const splitAmount = (amount / totalContributors).toFixed(2);
      const timestamp: string = new Date().toLocaleString();
  
      // Send notifications to contributors (excluding the sender)
      contributors.forEach((contributor) => {
        if (contributor !== wallet.address) {
          sendNotifications(contributor,   `You have to pay ${splitAmount} USDC to ${wallet.address} for split pay on ${selectedChain} at ${timestamp}`);
        }
      });
  
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
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

      <div className={styles.paymentControls}>
        <button onClick={() => handleSendTransaction(recipient)}  className={`${styles.payButton} ${isDeveloperTheme ? styles.greenButton : ""}`}>Pay</button>

         {isDeveloperTheme && (
        <select
        className={styles.chainSelect}
          value={selectedNet}
          onChange={(e) => {
            setSelectedNet(e.target.value);
            setSelectedChain(Object.keys(chains[e.target.value])[0]);
          }}
        >
          <option value="Testnet">Testnet</option>
          <option value="Local">Localnet</option>
        </select>
      )}

        <select className={styles.chainSelect} value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}>
          {Object.keys(chains[selectedNet]).map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ))}
        </select>
      </div>


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
