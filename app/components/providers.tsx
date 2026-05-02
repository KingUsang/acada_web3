"use client";

import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { ClusterProvider } from "./cluster-context";
import { WalletProvider } from "../lib/wallet/context";
import { SolanaClientProvider } from "../lib/solana-client-context";
import { AuthProvider } from "../lib/auth/context";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClusterProvider>
      <SolanaClientProvider>
        <WalletProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletProvider>
      </SolanaClientProvider>
      <Toaster position="bottom-right" richColors />
    </ClusterProvider>
  );
}
