"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import type { Database } from "../database.types";

type AppUser = Database["public"]["Tables"]["users"]["Row"];

interface Web3AuthUserInfo {
  name?: string;
  email?: string;
  profileImage?: string;
}

interface IdTokenPayload {
  sub?: string;
}

function parseIdTokenPayload(idToken: string): IdTokenPayload | null {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as IdTokenPayload;
  } catch {
    return null;
  }
}

interface AuthContextType {
  user: Web3AuthUserInfo | null;
  appUser: AppUser | null;
  userId: string | null;
  idToken: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authenticateUser: () => Promise<string | null>;
  refreshAppUser: (tokenOverride?: string | null) => Promise<AppUser | null>;
  provider: SafeEventEmitterProvider | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [user, setUser] = useState<Web3AuthUserInfo | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s_7ay_9s"; // Placeholder

  const refreshAppUser = useCallback(async (tokenOverride?: string | null) => {
    const token = tokenOverride ?? idToken;
    if (!token) {
      setAppUser(null);
      setUserId(null);
      return null;
    }

    const payload = parseIdTokenPayload(token);
    const nextUserId = payload?.sub ?? null;
    setUserId(nextUserId);

    if (!nextUserId) {
      setAppUser(null);
      return null;
    }

    try {
      const res = await fetch(`/api/users/${nextUserId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setAppUser(null);
        return null;
      }

      const json = (await res.json()) as { data?: AppUser };
      const nextAppUser = json.data ?? null;
      setAppUser(nextAppUser);
      return nextAppUser;
    } catch (error) {
      console.error("Failed to refresh app user:", error);
      setAppUser(null);
      return null;
    }
  }, [idToken]);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Devnet
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };

        const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          const nextUser = (await web3auth.getUserInfo()) as Web3AuthUserInfo;
          setUser(nextUser);
          const userAuthRes = await web3auth.authenticateUser();
          setIdToken(userAuthRes.idToken);
          await refreshAppUser(userAuthRes.idToken);
        }
      } catch (error) {
        console.error("Web3Auth Init Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [clientId, refreshAppUser]);

  const login = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      const nextUser = (await web3auth.getUserInfo()) as Web3AuthUserInfo;
      setUser(nextUser);
      const userAuthRes = await web3auth.authenticateUser();
      setIdToken(userAuthRes.idToken);
      await refreshAppUser(userAuthRes.idToken);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setUser(null);
    setAppUser(null);
    setUserId(null);
    setIdToken(null);
  };

  const authenticateUser = async () => {
    if (!web3auth) return null;
    const userAuthRes = await web3auth.authenticateUser();
    setIdToken(userAuthRes.idToken);
    await refreshAppUser(userAuthRes.idToken);
    return userAuthRes.idToken;
  };

  return (
    <AuthContext.Provider
      value={{ user, appUser, userId, idToken, isLoading, login, logout, authenticateUser, refreshAppUser, provider }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
