# Sprint Plan: Talambralu Frontend Integration (Active)

> **Note:** This document outlines the active frontend integration phase. It depends on the backend infrastructure and API which is already **100% complete**.
> For historical backend implementation details, please see [`sprint-status.md`](./sprint-status.md).

*Last Updated: 2026-05-21 (Story F1.3 code review complete — all patches applied)*

## Overview
This document outlines the sequenced implementation plan for integrating the React Native (Expo) frontend with the existing NestJS backend architecture.

---

## Epic 1: The Trust Moat Integration
**Objective:** Connect the frontend verification screens to the backend's AWS-powered event-driven pipeline (S3, Rekognition, Textract).

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `Story F1.1` | Face Verification (Camera UI & S3 Presigned Upload) | None | Medium | `DONE` |
| 2 | `Story F1.2` | Income/Visa Document Upload & Polling | `Story F1.1` | Medium | `DONE` |
| 3 | `Story F1.3` | User Profile Photo Management (CRUD) | `Story F1.1` | Medium | `DONE` |

**Epic Checkpoint:**
- [ ] User can take a selfie and upload it to S3 from the mobile app.
- [ ] User can upload PDF/Image documents for income/visa verification.
- [ ] App polls or listens for verification status updates and reflects them in the UI.

---

## Epic 2: Core Product Loop Integration
**Objective:** Enable the double opt-in matching system and real-time communication on the frontend.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 4 | `Story F2.1` | Match State Machine (Pass, Save, Like actions) | None | Medium | `BACKLOG` |
| 5 | `Story F2.2` | Matches & Shortlist Filtering / Sorting | `Story F2.1` | Small | `BACKLOG` |
| 6 | `Story F2.3` | WebSocket Connection Setup (Socket.io Client) | None | Medium | `BACKLOG` |
| 7 | `Story F2.4` | Real-time Chat UI Integration (Send/Receive) | `Story F2.3`, `F2.1` | Large | `BACKLOG` |

**Epic Checkpoint:**
- [ ] Swiping or tapping action buttons successfully updates match status in the backend.
- [ ] User can view their active matches and pending interests.
- [ ] Users can exchange real-time messages within an active match.

---

## Epic 3: Monetization & Polish
**Objective:** Integrate RevenueCat for paywalls and finalize user settings.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 8 | `Story F3.1` | RevenueCat SDK Integration & Paywall UI | None | Medium | `BACKLOG` |
| 9 | `Story F3.2` | Premium Feature Gating in App | `Story F3.1` | Small | `BACKLOG` |
| 10 | `Story F3.3` | Account Settings & GDPR Deletion | None | Small | `BACKLOG` |

**Epic Checkpoint:**
- [ ] The paywall displays correctly using RevenueCat offerings.
- [ ] Sandbox purchases successfully unlock premium UI features.
- [ ] User can successfully delete their account and be logged out.
