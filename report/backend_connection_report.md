# Backend Connection Audit & Implementation Report

## Scope Reviewed
- `report/*.md` status notes
- Frontend pages under `app/(frontend)/**/page.tsx`
- Existing backend routes under `app/api/**/route.ts`

## What Was Already Connected
- Student dashboard and home (`/api/users/[id]/dashboard`)
- Tutor home (`/api/users/[id]/tutor-stats`)
- Course listing and detail (`/api/courses`, `/api/courses/[id]`)
- Checkout payment flow (`/api/payments`)
- Sessions and classroom actions (`/api/sessions/*`, `/api/attendance/*`)
- Quiz attempt submit (`/api/quizzes/[id]/submit`)
- Credentials list + mint flow (`/api/certificates`, `/api/certificates/mint`)

## Gaps Found
1. `enrolment_confirmation` page had no backend connection and only placeholder content.
2. `credential_detail` page had no backend connection and only placeholder content.
3. There was no `GET /api/certificates/[id]` route, even though the code and reports implied credential-detail retrieval should exist.

## Implemented Fixes
1. Added `GET /api/certificates/[id]` in `app/api/certificates/[id]/route.ts`
   - Authenticated via Web3Auth token.
   - Returns certificate + related course and milestone data.
   - Enforces ownership (`certificate.user_id === token.sub`).

2. Wired `credential_detail` page to backend
   - Added `useCertificate(certificateId)` SWR hook in `app/lib/api.ts`.
   - Updated `app/(frontend)/credential_detail/page.tsx` to:
     - Read `id` from query params.
     - Fetch from `/api/certificates/[id]`.
     - Render loading/error states and real credential metadata.

3. Wired `enrolment_confirmation` page to backend
   - Updated `app/(frontend)/enrolment_confirmation/page.tsx` to:
     - Read `id` (course id) and `tx` from query params.
     - Fetch course via existing `/api/courses/[id]`.
     - Render real enrollment confirmation details.

4. Passed context from checkout to confirmation page
   - Updated `app/(frontend)/course_checkout/page.tsx` to redirect with:
     - `id` (course id)
     - `tx` (transaction reference)

## Remaining Pages Still Primarily UI-Only
- `acada_etheric`
- `class_recordings_library`
- `course_content_manager`
- `quiz_builder`
- `question_builder`
- `wallet_connection`

These remain mostly presentation pages in current code and reports, and need separate product decisions (data shape and write-flow UX) to wire safely to backend endpoints.
