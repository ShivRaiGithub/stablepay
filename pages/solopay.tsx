import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/solopay.module.css";
const { FaArrowLeft } = require("react-icons/fa");

import { createWalletClient, custom, encodeFunctionData } from "viem";
import { USDC_APPROVE_ABI, chains } from "../data/constants";
import { ConnectedWallet } from "@privy-io/react-auth";

const SoloPay = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedNet, setSelectedNet] = useState("Testnet"); // Default network
  const [selectedChain, setSelectedChain] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGreenTheme, setIsGreenTheme] = useState(false);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);

  useEffect(() => {
    if (router.query.wallets) {
      setWallets(JSON.parse(router.query.wallets as string));
    }
  }, [router.query.wallets]);

  useEffect(() => {
    const themeState = localStorage.getItem("greenTheme") === "true";
    setIsGreenTheme(themeState);

    const network = themeState ? "Testnet" : "Mainnet";
    setSelectedNet(network);
    setSelectedChain(Object.keys(chains[network])[0]); // Set first chain
  }, []);

  const handleToggle = () => {
    const newThemeState = !isGreenTheme;
    setIsGreenTheme(newThemeState);
    localStorage.setItem("greenTheme", newThemeState.toString());

    // Set network and default chain when toggling themes
    const network = newThemeState ? "Testnet" : "Mainnet";
    setSelectedNet(network);
    setSelectedChain(Object.keys(chains[network])[0]);
  };

  // Determine the active network based on the theme
  const selectedNetwork = isGreenTheme ? selectedNet : "Mainnet";

  useEffect(() => {
    setSelectedChain(Object.keys(chains[selectedNetwork])[0]); // Update chain when network changes
  }, [selectedNetwork]);

  const handleSendTransaction = async (walletAddress: string) => {
    const wallet = wallets[0];
    if (!wallet || !selectedChain) return;

    const chainData = chains[selectedNetwork][selectedChain];
    await wallet.switchChain(chainData.chain.id);

    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      chain: chainData.chain,
      transport: custom(provider),
    });

    await walletClient
      .sendTransaction({
        account: wallet.address as `0x${string}`,
        to: chainData.usdcAddress,
        chain: chainData.chain,
        data: encodeFunctionData({
          abi: USDC_APPROVE_ABI,
          functionName: "transfer",
          args: [walletAddress as `0x${string}`, BigInt(amount * 1000000)],
        }),
      })
      .then(console.log)
      .catch(console.error);
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
          <button
            onClick={async () => {
              handleSendTransaction(address);
            }}
            className={`${styles.payButton} ${isGreenTheme ? styles.greenButton : ""}`}
          >
            Pay
          </button>

          {/* Network Selection Dropdown (only when Green Theme is active) */}
          {isGreenTheme && (
            <select
              className={styles.selectNet}
              value={selectedNet}
              onChange={(e) => {
                setSelectedNet(e.target.value);
                setSelectedChain(Object.keys(chains[e.target.value])[0]); // Select first chain of new network
              }}
            >
              <option value="Testnet">Testnet</option>
              <option value="Local">Localnet</option>
            </select>
          )}

          {/* Chain Selection Dropdown */}
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
                  <div
                    key={chain}
                    onClick={() => {
                      setSelectedChain(chain);
                      setShowDropdown(false);
                    }}
                  >
                    {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloPay;
