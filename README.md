# Stablepay

**Stablepay** is a privy powered payment where you can use stablecoins like USDC to pay others.

## Fulfilling Requirements
The idea was to create an app powered by privy that allows payment through stablecoins

## Use of Privy

1. Privy has been used in our app to allow users to login through their emails or their wallets providing a significantly level of account abstraction 
2. Privy has also been used to create transactions of sending stable coins from your wallet to someone else

## Key Features
- **Login through email or wallet using privy** : You can use the power of privy to seamlessly login through your email id or through an existing wallet of yours.
- **Pay through Stablecoin(USDC)** : You can pay through stablecoins(currently only USDC) on various chains.
- **Add frequently interacted-with wallets as friends** : Pay a wallet frequently? Add the wallet as a friend and streamline the payment process.
- **Get notifications when you have to contribute to a payment** : When someone pays on behalf of the entire group, automatically get notified how much amount you owe them.

## Technologies Used
- **Partner Technology:** Privy
- **Frontend:** Nextjs
- **Backend:** Node.js, MongoDB


## Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/ShivRaiGithub/stablepay
   cd stablepay
   ```

2. Install dependencies
   ```bash
   npm install
   ```

4. Use .env.development file to know the variables needed to run the files. Change the .env.development file to .env file or create a new .env file with the variables needed.

5. Run the command to start the app:
   ```bash
   npm run dev
   ```
7. The port should now be working and ready to work on.
8. Go to respective port and the app should be working.

## Important Points
The USDC address of the chains available as found on the internet by us are as follows:   


#### Mainnet

1. Ethereum: 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48

2. Polygon: 0x3c499c542cef5e3811e1192ce70d8cc03d5c3359

3. Optimism: 0x0b2c639c533813f4aa9d7837caf62653d097ff85

4. Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

5. Arbitrum: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831

#### Testnet

1. Sepolia: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

2. BaseSepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

3. OptimismSepolia: 0x5fd84259d66Cd46123540766Be93DFE6D43130D7

4. ArbitrumSepolia: 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d

#### Local

1. Anvil: 0x5FbDB2315678afecb367f032d93F642f64180aa3

2. Localhost: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Please create an issue if you think we have the wrong address.   
In case of running the project locally, you change the address value in constants.ts located in data folder

## Structure

1. **Index** : Login page that allows u to login through privy
2. **Dashboard**: Home page after logging in. Allows you access to your profile, notifications, friends, payment, etc
3. **Profile**: Your profile page where you can link or unlink your socials
4. **Friends** : Add wallets you interact frequently with for ease of pay.
5. **Solo Pay** : Pay as an individual to someone
6. **Split Pay** : Pay on behalf of a group which can include or exclude you. The other group members will get the notification to pay you accordingly.
7. **Notification**: Shows notification of how much amount you owe someone along with the chain and time of their payment.
8. **Logout** : Logout from app.


## Special Feature: Developer Mode
Toggle the developer mode using toggle button on top right side of dashboard. The button is present between Notifications and Logout buttons.   
Enabling developer mode changes the theme to green and allows you to send testnet tokens of USDC of various chains to someone. It can be used in both solopay and splitpay. 


