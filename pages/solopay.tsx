import React, { useState } from "react";
import styles from "../styles/solopay.module.css";

import { createWalletClient, custom, encodeFunctionData } from "viem";

import {USDC_APPROVE_ABI, chains} from "../data/constants";


const SoloPay = ({wallets : any}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("Ehereum");
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedNetwork="Mainnet";

  const handleSendTransaction = async (friend: any) => {
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
            args: [friend.walletAddress, 100000n],
        }),
    }).then(console.log).catch(console.error);
};


  return (
    <div className={styles.container}>
      <h2>Solo Payment</h2>
      <input
        type="text"
        placeholder="Enter recipient address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <div className={styles.buttonContainer}>
        <button onClick={ async() => {handleSendTransaction(address)}} className={styles.payButton}>Pay</button>
        <div className={styles.dropdownContainer}>
          <button onClick={() => setShowDropdown(!showDropdown)} className={styles.chainButton}>
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
      </div>
    </div>
  );
};

export default SoloPay;
