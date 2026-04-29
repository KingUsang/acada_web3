# Web3Auth Frontend Integration Guide

This guide details how to integrate Web3Auth into the Acada frontend. Since Acada heavily relies on Web3Auth for authentication and Solana for on-chain interactions, the frontend requires setting up Web3Auth properly.

## 1. Prerequisites

You will need the following dependencies installed in the frontend:

```bash
npm install @web3auth/no-modal @web3auth/auth-adapter @web3auth/base @web3auth/solana-provider @solana/web3.js
```

Ensure you have your Web3Auth Client ID. This should be added to your `.env.local` file:
```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="your_web3auth_client_id_here"
```

## 2. Setting up the Context Provider

It is best practice to wrap your application in a context provider to easily access the Web3Auth instance, the user's provider, and the user's login state globally.

Create a `Web3AuthProvider.tsx` component (e.g., in `app/(frontend)/components/providers/Web3AuthProvider.tsx`):

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

// Define the context state
interface Web3AuthContextType {
  web3auth: Web3AuthNoModal | null;
  provider: IProvider | null;
  isLoading: boolean;
  login: (loginProvider: string, extraLoginOptions?: any) => Promise<void>;
  logout: () => Promise<void>;
  getJwtToken: () => Promise<string | null>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({} as Web3AuthContextType);

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // "0x1" for Mainnet, "0x2" for Testnet, "0x3" for Devnet
          rpcTarget: "https://api.devnet.solana.com", 
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
          ticker: "SOL",
          tickerName: "Solana",
        };

        const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

        const web3authInstance = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: "sapphire_devnet", // Use sapphire_mainnet for production
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter();
        web3authInstance.configureAdapter(authAdapter);

        setWeb3auth(web3authInstance);

        await web3authInstance.init();
        
        if (web3authInstance.connected) {
          setProvider(web3authInstance.provider);
        }
      } catch (error) {
        console.error("Web3Auth Initialization Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (loginProvider: string, extraLoginOptions?: any) => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider,
      extraLoginOptions,
    });
    setProvider(web3authProvider);

    // Call registration logic on successful login
    await handlePostLogin(web3auth);
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
  };

  const getJwtToken = async () => {
    if (!web3auth) return null;
    try {
      const authInfo = await web3auth.authenticateUser();
      return authInfo.idToken;
    } catch (error) {
      console.error("Error fetching JWT token:", error);
      return null;
    }
  };

  return (
    <Web3AuthContext.Provider value={{ web3auth, provider, isLoading, login, logout, getJwtToken }}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export const useWeb3Auth = () => useContext(Web3AuthContext);
```

Wrap this around your app in `app/(frontend)/layout.tsx`:
```tsx
import { Web3AuthProvider } from "./components/providers/Web3AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3AuthProvider>
          {children}
        </Web3AuthProvider>
      </body>
    </html>
  );
}
```

## 3. Registering the User with the Backend

Once the user successfully connects via Web3Auth, the frontend **must** send the user data to the Acada backend so a Supabase record is created. Add this utility function to your code (used in `handlePostLogin` above):

```tsx
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Connection } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";

export async function handlePostLogin(web3auth: Web3AuthNoModal) {
  try {
    const user = await web3auth.getUserInfo();
    const authInfo = await web3auth.authenticateUser();
    
    // Get the user's Solana wallet address
    const solanaWallet = new SolanaWallet(web3auth.provider!);
    const accounts = await solanaWallet.requestAccounts();
    const walletAddress = accounts[0];

    // Important: Call the backend register endpoint
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authInfo.idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        full_name: user.name,
        profile_image_url: user.profileImage,
        solana_wallet_address: walletAddress,
        role: "STUDENT" // or "TUTOR" depending on the UI flow
      }),
    });

    if (!response.ok) {
      console.error("Failed to register user in backend", await response.json());
    }
  } catch (error) {
    console.error("Error during post-login registration:", error);
  }
}
```

## 4. Making Authenticated API Calls

For all subsequent requests to the Acada API (`/api/courses`, `/api/enrollments`, etc.), you must pass the JWT token in the `Authorization` header.

Using the context hook:

```tsx
"use client";

import { useWeb3Auth } from "@/app/(frontend)/components/providers/Web3AuthProvider";
import { useEffect, useState } from "react";

export function CourseList() {
  const { getJwtToken, provider } = useWeb3Auth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!provider) return; // Wait until logged in
      
      const token = await getJwtToken();
      if (!token) return;

      const res = await fetch("/api/courses", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      setCourses(data.data || []);
    };

    fetchCourses();
  }, [provider, getJwtToken]);

  return (
    <div>
      {/* Map through courses */}
    </div>
  );
}
```

## 5. Fetching the Solana Wallet Address

If you need the user's Solana wallet address later in the app (e.g., for showing their balance, or passing to an API route), you can fetch it using the `SolanaWallet` class:

```tsx
import { SolanaWallet } from "@web3auth/solana-provider";

// Assuming you have access to the `provider` from the context
const getWalletAddress = async () => {
  const solanaWallet = new SolanaWallet(provider);
  const accounts = await solanaWallet.requestAccounts();
  const address = accounts[0];
  console.log("User Solana Wallet:", address);
};
```
