# Product Requirements Document (PRD): Talambralu

## 1. Objective
**What are we building and why?**
Talambralu is a premium matrimony platform specifically designed for the Telugu-speaking diaspora in the US and their matches in India. It aims to solve the problem of unverified, third-party managed profiles (often by parents or agents) prevalent in generic platforms. The core value proposition is **individual accountability** and **hard-data verification** (employment, income, liveness).

**Target Audience:**
- **Primary:** Telugu professionals residing in the US (H1-B, L1, Green Card, Citizens).
- **Secondary:** Highly qualified Telugu professionals in India seeking US matches.
- **Persona:** Tech-savvy, career-oriented individuals valuing transparency and efficiency.

**Success Criteria:**
- Successfully onboard users through a verified pipeline (OTP, Selfie, Paystub).
- Enable discovery based on verified attributes.
- Facilitate communication (chat, A/V calls) gated by a double opt-in and subscription model.

## 2. The Verification Moat (Key Differentiator)
- **Professional Identity:** Work Email OTP for "Verified Professional" badge.
- **Financial Transparency:** Paystub OCR (via AWS Textract) for "Income Verified" badge.
- **Physical Authenticity:** Biometric liveness checks (via Amazon Rekognition) for "Face Verified" badge.
- **Visa & ID Verification:** Planned for v1.1.

## 3. Tech Stack & Architecture Strategy
- **Frontend:** React Native (Android first, iOS later).
- **Backend Architecture:** Modular Monolith using Node.js (NestJS). Strict logical separation of domains (Auth, Profile, Verification, etc.) to allow future microservice extraction. Cross-domain SQL joins are strictly forbidden.
- **API & Compute:** AWS ALB routing to AWS ECS Fargate.
- **Database:** AWS RDS (Aurora PostgreSQL Serverless v2) for relational data and native text search.
- **Cache/Real-time:** AWS ElastiCache (Redis).
- **Auth:** Firebase Auth (JWT validation in NestJS).
- **Real-time Comm:** NestJS WebSockets + Redis + Aurora. Amazon Chime SDK for A/V.
- **Storage:** AWS S3 (with 14-day auto-delete lifecycle for verification docs).
- **Asynchronous Processing:** AWS SQS + SNS.
- **External Services:** Stripe (Payments), AWS Textract (OCR), Amazon Rekognition (Liveness), AWS SES/SNS/FCM (Notifications).

## 4. Core Modules & Features

### 4.1 Authentication Module
- Sign up: Phone (Firebase OTP) or Email (SES OTP), Google/Apple SSO.
- Account Deletion (GDPR/CCPA): Native PostgreSQL `ON DELETE CASCADE` + SQS trigger for S3 object cleanup.

### 4.2 Profile Creation Module
- Progressive onboarding with Completeness Bar.
- Fields spanning: Basic Details, Lifestyle, Education/Profession, Immigration/Family.
- Photos stored in S3 (signed URLs).

### 4.3 Verification Service
- Handles Work Email OTPs.
- Liveness checks via Rekognition.
- Paystub OCR pipeline: S3 upload -> SQS -> Textract -> DB update -> S3 deletion (on success) or DLQ (on failure, subject to 14-day lifecycle rule).

### 4.4 Discovery & Partner Preference
- Search powered by PostgreSQL native text search (`tsvector`/JSONB).
- Filters: Visa, Income, Verified badges, etc.
- Redis caching for feeds.

### 4.5 Match & Interest Module
- Actions: Send, Withdraw, Accept, Decline, Shortlist.
- Double Opt-in: Chat unlocks only upon mutual acceptance.
- 14-day expiry on unanswered interests.

### 4.6 Communication Module
- WebSockets for text chat (Redis pub/sub, Aurora persistence).
- Amazon Chime for A/V calls (Premium only).
- Ephemeral file sharing (signed S3 URLs).

### 4.7 Subscription & Payments (Native IAP via RevenueCat)
- **Hybrid Model:**
  - Free Tier: Basic profile, standard interests, Subsidized Matches (can chat if matched with Premium).
  - Premium: Unlocks chat initiation, advanced filters, monthly credits.
  - Credits: Microtransactions for Super Interests, Contact Unlocks, A/V Call Tokens.

### 4.8 Admin Module
- Uses Aurora Read-Replica for heavy queries.
- Dashboards for moderation and campaigns.

## 5. Phased Delivery Plan
- **Phase 1 (Foundation):** Infrastructure (CDK), CI/CD, Auth, Basic Profile, Verification (Email/Selfie).
- **Phase 2 (Core Loop):** Discovery, Match logic, Chat (WebSockets), Notifications.
- **Phase 3 (Monetization & Depth):** Stripe, Textract OCR, Chime A/V, GDPR Deletion Saga.
- **Phase 4 (Launch):** Admin dashboard, Performance testing, Play Store release.

## 6. Project Structure (Proposed Monolith)
```
/apps
  /mobile-app       -> React Native source
  /backend-monolith -> NestJS source
    /src
      /modules
        /auth
        /profile
        /verification
        /discovery
        ...
/infra              -> AWS CDK definitions
/docs               -> Project documentation
```

## 7. Open Questions / Assumptions to Validate
1. **Compliance vs. UX:** Is the Paystub OCR mandatory for onboarding, or a progressive enhancement? (Assumption: Progressive enhancement to reduce drop-off, though highly incentivized).
2. **Monetization Complexity:** Is the Credit system necessary for MVP, or can we launch with a simpler Flat Subscription first?
3. **Data Isolation:** Can we strictly enforce the "no cross-module SQL joins" rule in a monolithic ORM setup without sacrificing too much performance on complex discovery queries?

---
*Generated by BMad Method `bmad-create-prd`*
