# Sprint Plan: Talambralu Frontend Integration (Active)

> **Note:** This document outlines the active frontend integration phase. It depends on the backend infrastructure and API which is already **100% complete**.
> For historical backend implementation details, please see [`sprint-status.md`](./sprint-status.md).

*Last Updated: 2026-05-24 (F2.2 code review — 13 patches applied; story marked DONE)*

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

## Backend Additions (Unblocking F2.1)
**Objective:** Implement missing backend endpoints discovered during F2.1 code review.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| — | `Story B1.1` | PASS endpoint (`POST /v1/matches/pass`) + discovery filter | None | Small | `DONE` |
| — | `Story B1.2` | Shortlist endpoints (`POST/DELETE/GET /v1/shortlist`) | None | Small | `DONE` |

---

## Epic 2: Core Product Loop Integration
**Objective:** Enable the double opt-in matching system and real-time communication on the frontend.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 4 | `Story F2.1` | Match State Machine (Pass, Save, Like actions) | `B1.1`, `B1.2` | Medium | `DONE` |
| 5 | `Story F2.2` | Matches & Shortlist Filtering / Sorting | `Story F2.1`, `B1.2` | Small | `DONE` |
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
