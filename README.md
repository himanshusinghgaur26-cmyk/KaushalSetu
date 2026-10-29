# KaushalSetu — From Skill to Sustainable Income

KaushalSetu is a Hindi-first, mobile-first empowerment and well-being platform concept for rural women, SHGs, community volunteers, NGOs, and local opportunity providers in India.

## What works now

- Hindi-first responsive dashboard with Hindi/English toggle.
- Guest/demo experience: no registration or sensitive details required.
- Opportunity search, filters, saved state, and honest demo interest registration.
- Demo saves persist locally on the same browser for a smoother presentation; signed-in lesson progress syncs to Supabase when the public browser configuration is available.
- Short learning cards with progress tracking and completion feedback.
- Digital safety guidance covering OTP, UPI PINs, fake jobs, and suspicious links.
- Optional profile form with privacy-by-design messaging.
- Clear DEMO DATA labels and no invented employment, payment, medical, or government approval claims.
- Supabase migrations for public content, device-scoped interactions, authenticated profiles, authenticated lesson progress, reports, and an admin audit foundation.

## Run locally

```bash
npm install
npm run dev
```

The project uses Vite and opens in a browser. To test on an Android phone on the same Wi-Fi network, run the Vite server with a network host setting from your development environment and open the displayed local network address in Chrome. The app is designed for narrow screens and large touch targets.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Supabase configuration

The Supabase project is provisioned for this workspace. The migration `create_sakhi_mvp_tables` has been applied through the Supabase integration. For a separate deployment, use `.env.example` as the placeholder reference and provide the public URL and anonymous key through the hosting platform's environment settings. Never expose a service-role key in browser code.

The UI runs immediately in demo mode and uses clearly labeled sample content. To enable sign-in and cloud lesson progress, add the two `VITE_` variables from `.env.example` to the hosting environment and republish. The database migrations are already applied in the provisioned project. The current browser still uses bundled demo opportunities; production should seed reviewed records and connect those public reads before accepting real submissions.

## Publish and share

1. In Bolt, click **Publish** in the top-right corner.
2. Click **Publish** again and wait for deployment.
3. Copy the generated `.bolt.host` link from the chat or Publish menu.
4. Open that link on Android Chrome or share it with judges.
5. Add the hosting environment variables before republishing if you want real sign-in and cloud lesson progress.

This workspace does not expose a publishing action to the coding tools, so no public URL was generated automatically. The first Publish action creates the shareable URL.

## Architecture

- `src/App.tsx`: product flows, demo content, view navigation, saved state, learning progress, and honest interest confirmation.
- `src/index.css`: responsive visual system, mobile navigation, accessible focus styles, cards, dialogs, and responsive layouts.
- Supabase: shared tables with verification metadata, RLS, indexes, public demo visibility, device-scoped interactions, reports, and an admin audit foundation.

## Three-minute hackathon demo

1. Start on Home and point out the Hindi-first welcome, demo honesty banner, and privacy promise.
2. Open **काम**, search for “सिलाई”, save a card, and show its saved star.
3. Register interest and show the confirmation that clearly says it is a demo record, not a real application.
4. Open **सीखें**, complete the UPI safety lesson, and show progress moving from 33% to 67%.
5. Open **सुरक्षा** and demonstrate the OTP/UPI PIN guidance and fake-job warning.
6. Open **मेरी जानकारी**, show that the profile is optional and that Aadhaar, PIN, OTP, passwords, and full addresses are not requested.
7. Close with the scale path: reviewed local content, verified providers, authenticated admin review, and regional language expansion.

## Test checklist

### Android Chrome

- Open Home at 320–430px width.
- Navigate every bottom tab.
- Search “सिलाई” and confirm the result list updates.
- Save and unsave an opportunity.
- Register demo interest and confirm the honest success message.
- Complete a learning card and confirm progress changes.
- Open profile modal, use keyboard or touch fields, and close it.
- Confirm text remains readable and buttons have clear labels.

### Desktop browsers

- Resize from desktop to narrow mobile width.
- Tab through header, cards, bottom navigation, dialogs, and form controls.
- Confirm visible focus states.
- Run the lint, typecheck, and production build checks.

## Current limits and next production steps

- Demo content is fictional/sample content and must not be presented as live jobs or confirmed schemes.
- Guest saves remain local to the same browser; signed-in lesson progress syncs to Supabase when configured.
- Admin authentication, role checks, content editor, verification queue, and audit writes still require the production admin service layer.
- Official scheme and health links should be added only after source validation and regional review.
- Real opportunity applications, notifications, helplines, and payment integrations require explicit partnerships and server-side integrations.
- Before launch, add automated browser tests for search, save, interest confirmation, lesson completion, and authorization boundaries.

## Problem and impact framing

**Problem:** useful livelihood, learning, safety, scheme, and well-being information is fragmented and often hard to trust or use on low-cost phones.

**Target users:** rural women, SHGs, volunteers, NGOs, and responsible local opportunity providers.

**Value proposition:** one calm, Hindi-first starting point that connects assess → learn → match → work → grow without asking for unnecessary sensitive information.

**Suggested pilot measures:** completed learning lessons, verified opportunities discovered, safe referral clicks, saved opportunities, interest records that receive follow-up, and reported scam content resolved. These are measurement proposals, not current product claims.

**Risks:** misleading listings, privacy on shared phones, low connectivity, language and literacy differences, unsafe health or financial advice, and unverified providers. Mitigate with source dates, visible demo labels, minimum data collection, report review, official links, and human verification.


## Project identity note

The user-facing product name is **KaushalSetu**, matching the original SOCI-O-THON 2026 concept. Existing Supabase table names retain their `sakhi_` prefix to avoid breaking the current database migrations and configured backend. Do not rename these tables unless the database is migrated deliberately.
