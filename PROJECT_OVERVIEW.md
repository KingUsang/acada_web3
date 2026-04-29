# Acada Web3 Project Overview

## 1. Purpose & Stack
- **Purpose:** Solana-based dApp starter with a vault program and a full-stack learning platform (Acada).
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, wallet-standard, @solana/kit.
- **Backend:** Next.js API routes, Supabase, Web3Auth, LiveKit.
- **Solana Program:** Anchor (Rust) vault program, Codama-generated TypeScript client.

## 2. Project Structure
- `/app/(frontend)`: Frontend pages, layouts, UI components (student, tutor, auth, shared).
- `/app/api`: Backend API routes (RESTful, mapped to users, courses, enrollments, payments, sessions, attendance, quizzes, progress, certificates).
- `/app/lib`: Shared backend/util code (Supabase, Web3Auth, DB types, wallet, Solana client, hooks).
- `/app/components`: UI components (wallet, cluster switch, theme toggle, vault card, etc.).
- `/app/generated/vault`: Codama-generated client for Anchor vault program.
- `/anchor`: Anchor (Rust) program for the vault.
- `/stitch_acada_mobile_learning_app`: HTML code for mobile app screens (not integrated).

## 3. Key Features Implemented
- Wallet connection, cluster switching, balance display.
- Vault program: deposit/withdraw SOL to PDA vault.
- Web3Auth JWT authentication, user registration, protected API routes.
- RESTful backend API for all main resources.
- Supabase integration (admin/client SDKs, types).
- LiveKit integration for live sessions.
- Modern UI with Tailwind, theme toggle, toasts, grid backgrounds.

## 4. What’s Missing / Needs Attention
- **.env file:** Must set up with Supabase and LiveKit credentials.
- **Database:** Supabase schema must match `database.types.ts`.
- **Mobile app:** HTML files are not integrated.
- **Testing:** No explicit frontend/backend test setup.
- **Docs:** No detailed onboarding or contribution guide.
- **Deployment:** No production deployment scripts.
- **Anchor program:** Deploy your own if needed (see `anchor/README.md`).

## 5. How to Run
1. Install Node.js 18+, npm, Rust, Solana CLI, Anchor.
2. `npm install`
3. `npm run setup` (build Anchor, generate TS client)
4. Create `.env` with required variables (see backend README)
5. `npm run dev` (start Next.js app)

**For Anchor:**
- Install Rust, Solana CLI, Anchor
- Deploy program if needed (see `anchor/README.md`)

---

**Review this file for a high-level understanding of the project, stack, and setup requirements.**
