# Acada – Frontend

This folder contains all frontend pages, layouts, and UI components for the Acada app.

## 📁 Structure
```
(frontend)/
├── layout.tsx         # Root frontend layout (nav, providers, etc.)
├── page.tsx           # Landing/home redirect
├── (student)/         # Student-facing pages
│   ├── home/
│   ├── courses/
│   ├── courses/[id]/
│   ├── quiz/[id]/
│   ├── credentials/
│   └── checkout/[courseId]/
├── (tutor)/           # Tutor-facing pages
│   ├── home/
│   ├── courses/
│   └── schedule/
├── auth/              # Login / Signup pages
│   ├── login/
│   └── register/
└── components/        # Shared UI components
```

---

## 🔐 Authentication (Web3Auth)
The backend uses **Web3Auth JWT verification**. 

For a complete, step-by-step tutorial on how to install Web3Auth, set up the React Context Provider, register the user with our backend, and make authenticated API calls, please read the dedicated guide:

👉 **[Web3Auth Frontend Integration Guide](WEB3AUTH_GUIDE.md)**

---

## 📡 API Reference
All backend endpoints are available at `/api/...` and are documented in:
👉 [`implementation_plan.md`](../../.gemini/antigravity/brain/fc5ca1d6-a269-4143-ac99-1de31410da7e/implementation_plan.md)

### Quick Reference
| What you need | Endpoint |
|---|---|
| Student dashboard data | `GET /api/users/[id]/dashboard` |
| Tutor stats | `GET /api/users/[id]/tutor-stats` |
| List courses | `GET /api/courses?org_id=xxx` |
| Course detail + lessons | `GET /api/courses/[id]` |
| Enroll in course | `POST /api/enrollments` |
| LiveKit room token | `GET /api/sessions/[id]/token` |
| Submit quiz | `POST /api/quizzes/[id]/submit` |
| Get certificates | `GET /api/certificates?user_id=xxx` |
| Mint certificate NFT | `POST /api/certificates/mint` |

---

## 🚫 Don't Touch
- `app/api/` — Backend API routes
- `app/lib/` — DB utilities & auth logic
