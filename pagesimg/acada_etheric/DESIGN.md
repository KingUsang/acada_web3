# Design System: High-End Editorial EdTech

This design system is a bespoke framework designed to elevate educational technology from a utility to a premium experience. By blending the precision of Web3 decentralization with the authoritative clarity of high-end editorial design, we move beyond generic mobile templates to create a signature visual identity.

## 1. Creative North Star: "The Digital Curator"
The objective is to present information as a curated exhibition rather than a dense database. We achieve this through "The Digital Curator" philosophy: high-contrast typography, expansive breathing room, and a physical sense of depth. We reject the "boxed-in" look of standard apps in favor of an asymmetric, layered aesthetic that feels both architecturally sound and digitally fluid.

---

## 2. Color & Tonal Architecture
The palette is built on a sophisticated grayscale foundation, punctuated by a high-performance `#2563EB` blue.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or tonal transitions.
*   **Implementation:** Use `surface-container-low` for a section background sitting on a `surface` base. Let the eye perceive the edge through the change in value, not a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create "nested" depth:
*   **Level 0 (Base):** `surface` (#f9f9ff)
*   **Level 1 (Sections):** `surface-container-low` (#f1f3ff)
*   **Level 2 (Interactive Cards):** `surface-container-lowest` (#ffffff)
*   **Level 3 (Floating/Active):** `surface-container-highest` (#d8e2ff)

### The "Glass & Gradient" Rule
To bridge the gap between "Professional" and "Web3," use Glassmorphism for floating elements (e.g., wallet modals or sticky headers). Combine `surface-variant` at 60% opacity with a `backdrop-blur` of 20px. 

**Signature Texture:** CTAs should use a subtle linear gradient from `primary` (#0053db) to `primary-dim` (#0048c1) at a 135-degree angle to provide a "lithographic" depth that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We utilize a duo-font system to balance educational readability with technical sophistication.

*   **Display & Headlines (Manrope):** The heavy lifting is done by Manrope. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, "newsroom" feel.
*   **The Technical Label (Space Grotesk):** For data-heavy elements (wallet addresses, stat labels, role pills), we use Space Grotesk. This introduces the "Web3" personality—precise, monospaced-adjacent, and modern.
*   **Body (Manrope):** `body-lg` is your workhorse for educational content. Ensure a line height of 1.6x to prevent cognitive fatigue during long reading sessions.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely forbidden. Hierarchy is achieved through the **Layering Principle**.

*   **Ambient Shadows:** When a floating state is required (e.g., a Bottom Sheet), use a shadow color derived from `on-surface` at 4% opacity with a 32px blur and 16px Y-offset. It should feel like an atmospheric glow, not a "drop shadow."
*   **The "Ghost Border" Fallback:** If a layout absolutely fails accessibility without a stroke, use a "Ghost Border": `outline-variant` at 15% opacity.
*   **Glassmorphism:** Use semi-transparent `surface-container-lowest` (80% alpha) over `surface-dim` backgrounds to create a "frosted glass" effect for wallet connection buttons.

---

## 5. Component Guidelines

### Stat Cards & Progress Indicators
*   **The Rule:** No borders. Use `surface-container-low` for the card body. 
*   **Progress:** Use `primary-container` for the track and `primary` for the indicator. Forbid rounded caps on progress bars; use `none` or `sm` (0.125rem) for a more architectural, precise look.

### Wallet Connection Buttons
*   **Styling:** Utilize the `xl` (0.75rem) roundedness scale. 
*   **Visuals:** A `surface-container-lowest` background with a subtle `primary` glow (using the ambient shadow rule). The text should be `label-md` (Space Grotesk) to emphasize the technical nature of the connection.

### Role Toggle Pills
*   **Interaction:** Use the `full` roundedness scale. The inactive state should be `surface-container-high`. The active state should be `inverse-surface` with `inverse-on-surface` text, creating a high-contrast "brutalist" pop.

### Form Fields & Inputs
*   **Container:** No bottom line, no full border. Use a filled `surface-container-low` with a `md` (0.375rem) corner radius.
*   **Focus State:** Shift the background to `surface-container-highest` and transition the label color to `primary`.

### Bottom Tab Navigation
*   **Layout:** A "floating" island design. Use `surface-container-lowest` with a 20% `backdrop-blur`.
*   **Active State:** Avoid icons-in-circles. Use a single 4px `primary` dot (`surface_tint`) beneath the active icon to maintain editorial minimalism.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align headlines to the left but place stat values on the far right to create a dynamic visual path.
*   **Use Tonal Shifts:** If two elements need separation, change the background color of one by a single tier (e.g., `surface` to `surface-container-low`).
*   **Respect the "Space":** Use the `xl` (0.75rem) spacing token between unrelated content blocks to ensure the UI feels premium and unhurried.

### Don’t:
*   **Don't use 1px Dividers:** Use vertical white space or a subtle `surface-variant` background block instead.
*   **Don't use Pure Black:** Always use `inverse-surface` (#070e1d) for dark text or backgrounds to maintain tonal depth.
*   **Don't Over-Round:** Reserve the `full` roundedness for pills and small buttons only. Larger containers must use `xl` or `lg` to maintain a professional, structural feel.