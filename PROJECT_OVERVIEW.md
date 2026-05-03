# Acada Web3 Platform Overview

## 1. Vision & Purpose
Acada is a next-generation Learning Management System (LMS) built on Solana. It incentivizes student success by rewarding milestone completions with liquid **ACADA tokens** and verifiable **NFT Certificates** (Metaplex MPL Core).

## 2. Core Demo Flow
- **Onboarding**: Social login via Web3Auth (Google).
- **Course Lifecycle**: Free enrollment -> Content consumption -> Manual "Mark Complete" (for demo).
- **Rewards**: Quiz passing triggers an Oracle-signed reward. Tokens are minted via a gasless relayer.
- **Credentials**: Completed courses allow students to mint permanent on-chain diplomas.
- **Tutor Tools**: Course creation and real-time video classrooms via LiveKit.

## 3. Technology Stack
- **Framework**: Next.js 16 (App Router), React 19.
- **Auth**: Web3Auth (Social-to-Wallet) + JWT validation.
- **Blockchain**: 
  - **Anchor (Rust)**: Custom reward and configuration programs.
  - **Metaplex**: MPL Core for lightweight, professional certificates.
  - **Relayer**: Node.js backend for co-signing and gas sponsorship.
- **Database**: Supabase (Postgres, Row Level Security, Auth).
- **Real-time**: LiveKit for interactive live sessions.

## 4. Key Directory Structure
- `/app/(frontend)`: High-fidelity student/tutor interfaces.
- `/app/api`: Backend logic (Identity resolution, Relay, Oracle).
- `/app/lib/web3`: Solana instruction builders and PDA derivation.
- `/anchor`: Rust smart contracts for the rewards system.
- `/scripts`: Setup and maintenance utilities (e.g., `initialize_rewards.mjs`).

## 5. Setup Summary
1.  `npm install`
2.  Setup `.env.local` with Supabase, Web3Auth, and Solana keys.
3.  `anchor deploy` on devnet.
4.  `node scripts/initialize_rewards.mjs` to set up the config PDA.
5.  `npm run dev` to launch the dashboard.

---
**This document serves as a high-level roadmap for the Acada Web3 ecosystem.**
