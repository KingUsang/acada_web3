"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { ClusterProvider } from "./cluster-context";
import { WalletProvider } from "../lib/wallet/context";
import { SolanaClientProvider } from "../lib/solana-client-context";
import { AuthProvider } from "../lib/auth/context";

export function Providers({ children }: PropsWithChildren) {
  return (
<<<<<<< HEAD
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
=======
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
>>>>>>> 9293b2cdd9231c7f54cccd67f3d00dc5210d1d4f
      <ClusterProvider>
        <SolanaClientProvider>
          <WalletProvider>
            <AuthProvider>{children}</AuthProvider>
          </WalletProvider>
        </SolanaClientProvider>
        <Toaster position="bottom-right" richColors />
      </ClusterProvider>
    </ThemeProvider>
  );
}
