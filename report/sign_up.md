# Sign Up Page Implementation Report

## What Was Designed
- The Sign Up page was implemented in `app/sign_up/page.tsx`.
- It provides a high-conversion, transactional interface for new users to join the Acada ecosystem as either a Student or a Tutor.

## Key Choices & Alignment with DESIGN.md
- **Typography:** Used `Manrope` for brand identity and headlines, and `Space Grotesk` for all technical labels and technical metrics.
- **Transactional Layout:** Suppressed global navigation to focus entirely on the registration flow.
- **Ambient Visuals:** Added decorative glow elements in the background to create a premium, high-tech feel without distracting from the form.
- **Role Selection:** Implemented a high-contrast pill-style toggle for selecting between "Student" and "Tutor" roles.
- **Input Design:**
  - Integrated Material Symbols as inline icons within input fields for better visual cues.
  - Used `surface-container-low` for input backgrounds, aligning with the "No-Line Rule".
  - Included a visibility toggle for the password field.
- **Primary Action:** A large, high-contrast button with a brand gradient ("Create Account") and integrated icon.
- **Web-Only Feature Cards:** Added a side visual section for larger screens (lg breakpoint) to highlight key platform benefits (Curated Pathing, Verified Credentials) using a glass-panel effect.
- **Legal Footnote:** Included a professional disclaimer with links to Terms and Privacy Policy, using uppercase tracking for a technical look.

## Routing
- The Sign Up page is accessible at `/sign_up`.

## Backend Integration
- **API Endpoint Idea:** `POST /api/auth/register`
- **Contract:**
  ```json
  {
    "fullName": "string",
    "email": "string",
    "password": "string",
    "role": "student | tutor"
  }
  ```

## Important Code Snippets
```tsx
{/* Role Selection Toggle */}
<div className="flex p-1 bg-surface-container-high rounded-full w-full">
  <button className="flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 bg-inverse-surface text-on-primary">
    Student
  </button>
  <button className="flex-1 py-3 px-6 rounded-full font-label font-semibold text-sm transition-all duration-200 text-on-surface-variant hover:text-on-surface">
    Tutor
  </button>
</div>
```

---

*Sign Up page implementation complete.*
