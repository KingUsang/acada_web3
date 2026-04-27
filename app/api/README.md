# Acada – Backend (API & Lib)

This area contains all the backend logic: API routes, DB access, and Web3Auth verification.

## 📁 Structure
```
app/
├── api/                       # REST HTTP route handlers
│   ├── auth/register/         # POST — User registration after Web3Auth
│   ├── users/[id]/            # GET, PATCH — User profile
│   ├── organizations/         # GET, POST — Orgs
│   ├── courses/               # GET, POST — Courses
│   ├── courses/[id]/          # GET, PATCH — Single course
│   ├── courses/[id]/lessons/  # GET, POST — Lessons
│   ├── enrollments/           # GET, POST — Enrollments
│   ├── payments/              # GET, POST — Payments
│   ├── sessions/              # GET, POST — Live sessions
│   ├── sessions/[id]/token/   # GET — LiveKit JWT token
│   ├── attendance/join/       # POST — Attendance log (join)
│   ├── attendance/leave/      # POST — Attendance log (leave)
│   ├── quizzes/               # POST — Create quiz
│   ├── quizzes/[id]/          # GET — Fetch quiz
│   ├── quizzes/[id]/submit/   # POST — Submit answers
│   ├── progress/              # GET, PATCH — Course progress
│   ├── milestones/check/      # POST — Check certificate eligibility
│   └── certificates/          # GET, POST/mint
└── lib/
    ├── supabase/
    │   ├── admin.ts           # Service-role Supabase client
    │   ├── server.ts          # SSR Supabase client
    │   └── client.ts          # Browser Supabase client
    ├── auth/
    │   └── verify-web3auth.ts # JWT verification from Web3Auth JWKS
    └── database.types.ts      # Auto-generated Supabase schema types
```

## 🔑 Auth Pattern
Every protected route handler calls `verifyWeb3AuthToken(req)` first.
Returns the decoded Web3Auth payload including `sub` (user ID).

## 🌍 Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # Admin operations only
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=...
```

## 🚫 Don't Touch
- `app/(frontend)/` — All frontend work lives here
