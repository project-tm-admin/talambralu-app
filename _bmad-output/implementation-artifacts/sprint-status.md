
# Sprint Plan: Talambralu MVP

## Overview
This document outlines the sequenced implementation plan for the Talambralu platform. The implementation is broken into four distinct Sprints, designed to deliver verifiable, working slices of the architecture from the ground up.

---

## Sprint 1: Foundation & Identity
**Objective:** Establish the deployable AWS infrastructure, the core NestJS application, and secure user identity.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `Story 1.1` | AWS Infrastructure Setup (CDK) | None | Large | `DONE` |
| 2 | `Story 1.2` | Base NestJS Application & CI/CD | `Story 1.1` | Medium | `DONE` |
| 3 | `Story 1.3` | Firebase Auth Integration | `Story 1.2` | Small | `DONE` |
| 4 | `Story 1.4` | Base Profile Management (CRUD) | `Story 1.3` | Medium | `DONE` |

**Sprint Checkpoint:**
- [ ] CDK deployment succeeds.
- [ ] NestJS app is running in Fargate.
- [ ] A user can successfully register via Firebase and retrieve their profile via the API.

---
*Last Updated: 2026-05-13*

---

## Sprint 2: The Trust Moat
**Objective:** Implement the core verification capabilities (S3 uploads, AWS Textract, Amazon Rekognition) using event-driven architecture.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 5 | `Story 2.1` | S3 Upload & Image Handling (SQS triggers) | `Story 1.4` | Medium | `DONE` |
| 6 | `Story 2.2` | Liveness Check (Rekognition Worker) | `Story 2.1` | Medium | `DONE` |
| 7 | `Story 2.3` | Income Verification (Textract Worker) | `Story 2.1` | Large | `DONE` |

**Sprint Checkpoint:**
- [ ] User can request an S3 presigned URL and upload a file.
- [ ] SQS consumers successfully process the files and update the user's profile with verified flags.

---

## Sprint 3: Core Product Loop
**Objective:** Enable users to find each other, express interest, and communicate.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 8 | `Story 3.1` | Profile Search & Discovery (Postgres TSVector) | `Story 1.4` | Medium | `TODO` |
| 9 | `Story 3.2` | Double Opt-In State Machine (Interests) | `Story 3.1` | Medium | `TODO` |
| 10 | `Story 4.1` | WebSocket Infrastructure (Redis Pub/Sub) | `Story 1.3` | Medium | `TODO` |
| 11 | `Story 4.2` | Real-time Messaging (Persistence) | `Story 4.1`, `3.2` | Large | `TODO` |

**Sprint Checkpoint:**
- [ ] Users can query the discovery endpoint with filters.
- [ ] Two users can successfully mutually match.
- [ ] Matched users can exchange real-time WebSocket messages.

---

## Sprint 4: Monetization & Compliance
**Objective:** Gate premium features via Stripe and implement administrative/compliance requirements.

| Order | ID | Task | Dependency | Est. Scope | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 12 | `Story 5.1` | Stripe Webhook Infrastructure | `Story 1.2` | Small | `TODO` |
| 13 | `Story 5.2` | Premium Subscription Gating | `Story 5.1` | Medium | `TODO` |
| 14 | `Story 6.1` | GDPR Account Deletion Saga (S3/DB Cleanup) | `Story 2.1`, `4.2`| Large | `TODO` |
| 15 | `Story 6.2` | Admin API via Read-Replica | `Story 1.1` | Small | `TODO` |

**Sprint Checkpoint:**
- [ ] Stripe webhook successfully updates a user's subscription tier.
- [ ] Free users are blocked from Premium routes.
- [ ] A deleted profile cascades correctly and triggers S3 cleanup.
- [ ] Admin endpoint successfully reads from the Aurora Replica.
