import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import styles from "../styles/solopay.module.css";
const { FaArrowLeft } = require("react-icons/fa");

import { createWalletClient, custom, encodeFunctionData } from "viem";

import {USDC_APPROVE_ABI, chains} from "../data/constants";

import { ConnectedWallet } from "@privy-io/react-auth";


const SoloPay = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedChain, setSelectedChain] = useState("Select Chain");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNet, setSelectedNet] = useState("Testnet");
  const [isGreenTheme, setIsGreenTheme] = useState(false);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const selectedNetwork="Mainnet";


  useEffect(() => {
    if (router.query.wallets) {
      setWallets(JSON.parse(router.query.wallets as string));
    }
  }, [router.query.wallets]);
  
  useEffect(() => {
    const themeState = localStorage.getItem("greenTheme");
    setIsGreenTheme(themeState === "true");
  }, []);

  const handleToggle = () => {
    const newThemeState = !isGreenTheme;
    setIsGreenTheme(newThemeState);
    localStorage.setItem("greenTheme", newThemeState.toString());
  };
  
  

  const handleSendTransaction = async (walletAddress: string) => {
    const wallet = wallets[0];
    if (!wallet) return;
    const chainData = chains[selectedNetwork][selectedChain];
    await wallet.switchChain(chainData.chain.id);
    
    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
        chain: chainData.chain,
        transport: custom(provider),
    });

    await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: chainData.usdcAddress,
        chain: chainData.chain,
        data: encodeFunctionData({
            abi: USDC_APPROVE_ABI,
            functionName: "transfer",
            args: [walletAddress as `0x${string}`, BigInt(amount * 1000000)],
        }),
    }).then(console.log).catch(console.error);
};



  return (
    <div className={`${styles.container} ${isGreenTheme ? styles.greenTheme : ""}`}>
      {/* Top Bar with Back Button and Toggle */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={isGreenTheme} onChange={handleToggle} />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Centered Solo Payment UI */}
      <div className={styles.content}>
        <h2 className={`${styles.title} ${isGreenTheme ? styles.greenText : ""}`}>Solo Payment</h2>
        <input
          type="text"
          placeholder="Enter recipient address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
        />
        <input
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className={styles.input}
        />
        
                 
        
        <div className={styles.buttonContainer}>
          <button onClick={ async() => {handleSendTransaction(address)}} className={`${styles.payButton} ${isGreenTheme ? styles.greenButton : ""}`}>Pay</button>
          <div className={styles.dropdownContainer}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`${styles.chainButton} ${isGreenTheme ? styles.greenButton : ""}`}
            >
              {selectedChain} ▼
            </button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
 {Object.keys(chains[selectedNetwork]).map((chain) => (
                <div key={chain} onClick={() => { setSelectedChain(chain); setShowDropdown(false); }}>
                  {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
          {isGreenTheme && (
            <select className={styles.selectNet} onChange={(e) => setSelectedNet(e.target.value)}>
              <option value="net1">Net 1</option>
              <option value="net2">Net 2</option>
              <option value="net3">Net 3</option>
            </select>

          )}
        </div>
      </div>
    </div>
  );
};

export default SoloPay;
