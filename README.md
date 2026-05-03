# Acada Web3 Platform 🎓

Acada is a decentralized learning management system (LMS) that incentivizes academic excellence through on-chain rewards and verifiable credentials. Built for the modern student and tutor, it leverages the Solana blockchain to provide gasless interactions, instant rewards, and tamper-proof certifications.

## 🚀 Vision
To bridge the gap between traditional learning and Web3 by rewarding students for their achievements with liquid tokens and professional-grade NFT certificates.

## ✨ Core Features
- **Incentivized Learning**: Earn ACADA tokens automatically upon passing quizzes and completing courses.
- **Gasless Experience**: Students interact with the blockchain without needing SOL, thanks to our custom Relayer infrastructure.
- **Verifiable Credentials**: Mint professional NFT diplomas via Metaplex MPL Core.
- **Live Interactive Classes**: Integrated LiveKit sessions with automated attendance tracking and real-time video.
- **Academic Marketplace**: Browse and enroll in courses (currently set to free for demo purposes).
- **Secure Oracle System**: Rewards are signed by a backend oracle to prevent unauthorized minting.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (Turbopack), Tailwind CSS, Framer Motion.
- **Authentication**: Web3Auth (Social Login via Google to a Solana Wallet).
- **Blockchain**: Solana (Anchor Framework).
- **Smart Contracts**: 
  - `acada_rewards`: Token distribution and claim logic.
  - `acada_certificates`: Verification and metadata management.
- **Backend/DB**: Supabase (Postgres, Auth, Storage).
- **Media**: LiveKit for real-time video classrooms.

## ⚙️ Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd acada_web3
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root and populate it with the following:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Web3Auth
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
ORACLE_SECRET_KEY=[...your_oracle_key_array...]
RELAYER_SECRET_KEY=[...your_relayer_key_array...]
CERTIFICATE_ISSUER_SECRET_KEY=[...your_issuer_key_array...]

# LiveKit
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-host.livekit.cloud
```

### 3. Deploy Smart Contracts
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```

### 4. Initialize the Reward Mint
One-time setup to create the on-chain configuration and the ACADA token mint PDA:
```bash
node scripts/initialize_rewards.mjs
```

### 5. Run the App
```bash
npm run dev
```

---

## 🏆 Judge's Walkthrough (Step-by-Step)

To experience the full Acada ecosystem, follow this flow:

### 1. Authentication
- Click **"Sign In"** or **"Get Started"**.
- Choose **"Sign in with Google"**. Web3Auth will automatically generate a non-custodial Solana wallet for you.
- Complete the onboarding to land on your dashboard.

### 2. The Student Journey (Earning Rewards)
1. **Browse Courses**: Navigate to the course marketplace. For this demo, all courses are free to enroll.
2. **Enroll**: Click "Enroll Now" on a course (e.g., "Web3 Development 101").
3. **Learn**: Go to the **Course Detail** page. You can view the syllabus and lessons.
4. **Fast-Track Progress (Demo Feature)**: Click the **"Mark Course Complete (Demo)"** button to instantly move your progress to 100%.
5. **Take the Quiz**: With the course complete, take the final quiz.
6. **Claim ACADA Tokens**: After passing the quiz, click **"Claim Reward"**. 
   - Observe the **Gasless Transaction**: You will NOT be asked to pay SOL. Our relayer handles the gas fee.
   - You will receive 10 ACADA tokens directly to your wallet.
7. **Verify Balance**: Go to your **Profile** or **Student Dashboard** to see your updated ACADA token balance.

### 3. Verifiable Certification
1. **Mint Certificate**: Once the course is 100% complete, click **"Claim Certificate"**.
2. **View NFT**: Navigate to your **Credentials** page.
3. **Verify**: Click on your new certificate to see the on-chain metadata, minted via Metaplex MPL Core.

### 4. The Tutor Experience (Live Sessions)
1. **Create Course**: Navigate to the Tutor Dashboard (`/tutor_home`) and create a new course.
2. **Go Live**: Start a **Live Session**. This uses LiveKit to create a real-time video classroom.
3. **Attendance**: As students join, the system automatically tracks attendance on-chain.

---

## 🏗 Architecture Detail

### The Gasless Relay
Acada uses a "Server-Authorized, Client-Submitted" model. When a student earns a reward:
1. The **Oracle** signs an Ed25519 message validating the claim.
2. The **Client** builds a transaction including the Ed25519 proof.
3. The **Relayer** co-signs the transaction and pays the gas fee (SOL).
4. The transaction is submitted to Solana, minting tokens directly to the student.

### Identity Resolution
The platform seamlessly maps social identities (emails) to Solana wallet addresses, ensuring a consistent experience across Web3Auth logins and Supabase user records.

---
Built with ❤️ for the Solana Hackathon.
