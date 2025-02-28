
export const USDC_APPROVE_ABI = [
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;

  import { anvil, localhost } from "viem/chains";
  import { mainnet, arbitrum, base, polygon, optimism } from "viem/chains";
  import { sepolia, arbitrumSepolia, baseSepolia, optimismSepolia } from "viem/chains";
  

  
export const chains = {
    Mainnet: {
        Ethereum: { chain: mainnet, usdcAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
        Polygon: { chain: polygon, usdcAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359" },
        Optimism: { chain: optimism, usdcAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" },
        Base: { chain: base, usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
        Arbitrum: { chain: arbitrum, usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" },
    },
    Testnet: {
        Sepolia: { chain: sepolia, usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" },
        BaseSepolia: { chain: baseSepolia, usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" },
        OptimismSepolia: { chain: optimismSepolia, usdcAddress: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7" },
        ArbitrumSepolia: { chain: arbitrumSepolia, usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" },
    },
    Local: {
        Anvil: { chain: anvil, usdcAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3" },
        Localhost: { chain: localhost, usdcAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3" },
    },
};

