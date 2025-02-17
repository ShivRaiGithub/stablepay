import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";

import {defineChain} from 'viem';

import {mainnet} from 'viem/chains';

import {addRpcUrlOverrideToChain} from '@privy-io/react-auth';

const mainnetOverride = addRpcUrlOverrideToChain(mainnet, "http://127.0.0.1:8545");

export const myCustomChain = defineChain({
  id: 31337, // Replace this with your chain's ID
  name: 'Foundry Local',
  nativeCurrency: {
    decimals: 18,
    name: 'FoundryETH',
    symbol: 'FETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {name: 'LocalExplorer', url: 'etherscan.io'},
  },
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Privy Auth Starter</title>
        <meta name="description" content="Privy Auth Starter" />
      </Head>
      
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          defaultChain: myCustomChain, 
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          supportedChains: [mainnetOverride, myCustomChain],
        }}
      >
        <Component {...pageProps} />
      </PrivyProvider>
    </>
  );
}

export default MyApp;
