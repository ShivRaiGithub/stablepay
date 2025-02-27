import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/solopay.module.css";
const { FaArrowLeft } = require("react-icons/fa");

import { useDeveloperTheme } from "../context/DeveloperThemeContext";

import { createWalletClient, custom, encodeFunctionData } from "viem";
import { USDC_APPROVE_ABI, chains } from "../data/constants";
import { ConnectedWallet } from "@privy-io/react-auth";

const SoloPay = () => {
  const router = useRouter();
  const { isDeveloperTheme } = useDeveloperTheme(); // Get theme state from context
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedNet, setSelectedNet] = useState(isDeveloperTheme ? "Testnet" : "Mainnet"); // Default network based on theme
  const [selectedChain, setSelectedChain] = useState(Object.keys(chains[selectedNet])[0]); // First chain of the network
  const [showDropdown, setShowDropdown] = useState(false);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);

  useEffect(() => {
    if (router.query.wallets) {
      setWallets(JSON.parse(router.query.wallets as string));
    }
  }, [router.query.wallets]);

  // Update network and chain when the theme changes
  useEffect(() => {
    const network = isDeveloperTheme ? "Testnet" : "Mainnet";
    setSelectedNet(network);
    setSelectedChain(Object.keys(chains[network])[0]); // Reset chain
  }, [isDeveloperTheme]);

  const selectedNetwork = isDeveloperTheme ? selectedNet : "Mainnet";

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
    <div className={`${styles.container} ${isDeveloperTheme ? styles.greenTheme : ""}`}>
      {/* Top Bar with Back Button */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
      </div>

      {/* Centered Solo Payment UI */}
      <div className={styles.content}>
        <h2 className={`${styles.title} ${isDeveloperTheme ? styles.greenText : ""}`}>Solo Payment</h2>
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
            className={`${styles.payButton} ${isDeveloperTheme ? styles.greenButton : ""}`}
          >
            Pay
          </button>

          {/* Network Selection Dropdown (only when Green Theme is active) */}
          {isDeveloperTheme && (
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
              className={`${styles.chainButton} ${isDeveloperTheme ? styles.greenButton : ""}`}
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
