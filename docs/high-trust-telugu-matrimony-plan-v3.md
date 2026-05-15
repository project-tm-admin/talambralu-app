# **Project Overview: High-Trust Telugu Matrimony — Full Platform Plan v3.1**

> **Changelog from v3.0:**
> - ✅ Streamlined Auth: Standardized on Firebase Auth with API Gateway native JWT Authorizers.
> - ✅ Refined Deployment: Shifted from Day-1 distributed microservices to a **Modular Monolith** deployment strategy for faster launch velocity.
> - ✅ Enhanced Compliance: Added Distributed Deletion Saga for GDPR/CCPA "Right to be Forgotten".
> - ✅ Clarified Admin Data Access: Defined event-driven read models and read-replicas for cross-domain admin queries.

---

## **The Core Proposition**

A premium matrimony platform specifically designed for the **Telugu-speaking diaspora in the US** and their matches in India. Unlike generic platforms where profiles are often managed by third parties (parents/agents) with unverified data, our platform centers on **individual accountability** and **hard-data verification**.

### **Target Audience**

- **Primary:** Telugu professionals residing in the US (H1-B, L1, Green Card, Citizens).
- **Secondary:** Highly qualified Telugu professionals in India looking for matches in the US.
- **Persona:** Tech-savvy, career-oriented individuals who value transparency and efficiency over traditional "bio-data" exchanges.

### **The Moat: Verification-First Ecosystem**

Our competitive advantage lies in the **"Verified Badge"** system:

1. **Professional Identity:** Work Email OTP (proving employment at stated companies).
2. **Financial Transparency:** AI-driven Paystub OCR via AWS Textract (confirming income brackets).
3. **Physical Authenticity:** Biometric liveness checks (preventing catfishing) via Amazon Rekognition.
4. **Visa Verification:** Verified visa status badge (v1.1).
5. **ID Verification:** Government ID check (v1.1).

---

## **Revised Technical Stack — AWS-Native**

| Component | Technology | AWS Service / Reasoning |
| :--- | :--- | :--- |
| **Mobile UI** | React Native | Single codebase for Android (immediate) and iOS (future). |
| **Backend Framework** | Node.js (NestJS) | **Modular Monolith:** Built as logically isolated modules, deployed as a single Fargate task for launch velocity. Can be split into microservices later. |
| **API Layer** | **AWS ALB (Application Load Balancer)** | Routes traffic to NestJS; Auth Guards inside NestJS validate Firebase JWTs. |
| **Compute** | **AWS ECS Fargate** | Serverless containers; auto-scales the backend application. No EC2 management overhead. |
| **Database** | **AWS RDS (Aurora PostgreSQL Serverless v2)** | Relational integrity for profiles, match state, subscriptions. Serverless v2 auto-scales. |
| **Cache / Real-time State** | **AWS ElastiCache (Redis)** | Session handling, discovery feed caching (TTL ~15 min), pub/sub for chat presence. |
| **Auth** | **Firebase Auth** | Mobile OTP/Google/Apple SSO. NestJS validates Firebase tokens natively, protecting all backend routes. |
| **Real-time Chat** | **NestJS WebSockets + Redis + Aurora** | Native WebSockets over ALB. Redis handles pub/sub across Fargate instances. Messages stored in Aurora. |
| **Audio/Video Calls** | **Amazon Chime SDK** | Fully managed; integrates natively with the AWS ecosystem. |
| **File Storage** | **AWS S3** | Profile photos, selfie uploads, horoscope PDFs. Bucket policies enforce 14-day auto-delete lifecycle rules for failed verification docs. |
| **Background Jobs** | **AWS SQS + SNS** | Decouples main thread from heavy OCR, image processing, and notification tasks. Dead-letter queues (DLQ) guarantee retries. |
| **Push Notifications** | **AWS SNS + Firebase FCM** | SNS for fan-out; FCM for Android/iOS device delivery. |
| **Email Campaigns** | **AWS SES** | Transactional emails, campaign emails, and verification OTPs. |
| **OCR / Verification** | **AWS Textract** | Paystub OCR for income verification pipeline. |
| **Face Verification** | **Amazon Rekognition** | Face liveness detection replacing manual selfie review. |
| **Search** | **Aurora PostgreSQL (Native Text Search)** | Powers full-text and filtered discovery search via JSONB and tsvector, reducing V1 infra complexity. |
| **Payment Processing** | **Stripe** | Subscription billing, invoicing, refund workflows. |
| **CI/CD & Infrastructure** | **GitHub Actions + AWS CDK** | Infrastructure as Code (CDK) is mandatory for AWS setup. Automated Android builds delivered via Firebase App Distribution. |
| **Observability** | **AWS CloudWatch + AWS X-Ray** | Centralized logging, distributed tracing. |
| **Secrets Management** | **AWS Secrets Manager** | Securely store DB credentials, API keys, Firebase service accounts. |

---

## **Modular Monolith Architecture**

To balance launch velocity with future scalability, the backend is architected as a **Modular Monolith**. The code is organized into strict, independent NestJS modules (domain-driven design). They communicate via in-memory events or SQS for asynchronous tasks, but are compiled and deployed together on day 1.

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Native App                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WebSockets
                ┌───────────▼────────────┐
                │ AWS Application Load   │
                │ Balancer (ALB)         │
                └───────────┬────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │        Modular Monolith (NestJS)      │
        │                                       │
        │  [Auth Module]       [Profile Module] │
        │  [Verification]      [Discovery]      │
        │  [Match/Interest]    [Communication]  │
        │  [Subscription]      [Notification]   │
        │  [Admin/Marketing]                    │
        └───────────────────┬───────────────────┘
                            │
Async background tasks: AWS SQS (Image processing, OCR, Emails)
Data stores: Logical schema separation in a shared Aurora PostgreSQL instance. Cross-module SQL joins are STRICTLY FORBIDDEN to preserve microservice extractability.
```

### **Module Responsibilities & Data Isolation**

The code is modularly organized in NestJS, and strict data isolation is enforced. Modules must communicate via in-memory service calls or events; direct SQL joins across domain boundaries are forbidden.

| Module | Core Responsibility |
| :--- | :--- |
| **Auth Module** | Integrates with Firebase, handles user onboarding/deletion. Deletions cascade through the database natively (`ON DELETE CASCADE`), and trigger SQS to delete S3 assets. |
| **Profile Module** | Owns core user attributes, media references, completeness score. |
| **Verification Module** | Handles Textract pipelines, Rekognition checks, OTPs. |
| **Discovery Module** | Powers full-text and filtered searches directly via PostgreSQL JSONB and tsvector indexing. |
| **Match Module** | Manages the double opt-in state machine for connections. |
| **Communication Module**| Handles native NestJS WebSockets, manages Redis pub/sub presence, and stores chat history in Aurora. |
| **Subscription Module** | Stripe webhooks and entitlement management. |
| **Admin Module** | **Data Strategy:** Uses Aurora Read-Replicas for heavy cross-domain analytical queries without impacting production performance. |

---

## **Complete Feature Specification**

### **1. Authentication Module**

- Sign up with phone number (OTP via Firebase Auth)
- Sign up with email (OTP via AWS SES)
- Google login (Firebase OAuth)
- Apple login (Firebase OAuth — required for iOS)
- Forgot password / password reset flow
- **Security:** NestJS Auth Guards validate Firebase JWTs locally, protecting all API and WebSocket routes.
- **Account Deletion (GDPR/CCPA):** Handled natively via PostgreSQL `ON DELETE CASCADE` to wipe the user's profile, matches, and chat history. A targeted SQS job is fired to scrub S3 objects (photos/documents).

---

### **2. Profile Creation Module**

> **Design Principle:** Split into progressive sessions. A visible **Profile Completeness Bar** nudges users.

#### **Basic Details**
First/Last name, Gender, DOB, Height, Marital status, Mother tongue, Religion, Caste, Sub-caste, Raasi, Bio, Disability.

#### **Personal & Lifestyle**
Food, Smoking, Drinking, Fitness, Values, Relocation, Divorce/Children openness, Hobbies.

#### **Education & Professional**
Degree, University, Graduation Year, Occupation, Employer, Job Title, Income Bracket, Location, Work Type (Remote/Onsite).

#### **USA Immigration & Family**
Visa type, Settlement intentions, Parents' occupations, Family status, Siblings, Native place, Family in US/India.

#### **Photos & Media**
- Profile photo (mandatory; selfie liveness check on upload)
- Additional photos (up to 6; optional)
- All photos stored in AWS S3 with signed URL access (not public).

---

### **3. Verification Service**

| Verification Type | Implementation | Badge |
| :--- | :--- | :--- |
| **Work Email OTP** | User provides work email; backend sends OTP via SES; verified on match → **"Verified Professional"** badge | ✅ Verified Professional |
| **Identity / Selfie** | Selfie upload → Amazon Rekognition liveness check | ✅ Face Verified |
| **Income Verification** | User uploads redacted paystub behind legal disclosure screen; AWS Textract extracts income bracket; DLQ ensures retry on failure | ✅ Income Verified |
| **Visa Verification** | Self-declared at launch; document-backed verification in v1.1 | ✅ Visa Verified (v1.1) |
| **ID Verification** | Government ID check via third-party API — v1.1 | ✅ ID Verified (v1.1) |

**Document Handling (Paystub OCR Pipeline):**
1. User reviews legal disclosure screen.
2. File uploaded to a dedicated S3 bucket with a 14-day auto-delete lifecycle rule.
3. S3 upload triggers SQS → Verification Module processes via Textract.
4. Extracted data written to profile.
5. **Success:** File explicitly deleted from S3 immediately by the success handler.
6. **Failure:** Routed to DLQ for retry. If permanent failure, the 14-day S3 rule cleans up the orphaned file.

---

### **4. Partner Preference Module (Optional)**

Users define what they're looking for, used to rank discovery results. Features Mandatory (deal-breakers) and Nice-to-have filters spanning age, height, education, location, visa, and lifestyle choices.

---

### **5. Search & Discovery Module**

Powered by **Aurora PostgreSQL native text search (tsvector/JSONB)** with Redis caching (TTL ~15 min per user feed).
- **Browse Modes:** Filtered search, Recommended matches, Carousel mode.
- **Sections:** Recently joined, Verified profiles, USA-based only, Telugu only, Premium.
- **Advanced Filters:** Visa type, Verified badges, Income bracket, Relocation openness.
- **Alerts:** Save search configurations and get notified of new matches.

---

### **6. Match & Interest Module**

- **Actions:** Send, Withdraw, Accept, Decline interest, Shortlist, View visitors.
- **Double Opt-in Rule:** Chat unlocks ONLY when both users accept.
- **Expiry:** Unanswered interests expire after 14 days.

---

### **7. Communication Module**

- **In-app text chat:** NestJS WebSockets + Redis Pub/Sub, with message history persisted in Aurora PostgreSQL.
- **Audio & video calls:** Amazon Chime SDK.
- **File Sharing:** Horoscope / PDF sharing via S3 signed URLs (expires in 1h).
- **Rules:** Only verified users can initiate chat. Audio/video calls are premium.

---

### **8. Subscription & Payments Module**

Powered by **Stripe**. Implementing a **Hybrid "Premium-Subsidized + Credit" Model**.
- **Free Tier:** Can create a profile, verify, browse, and send standard Interests. If they Match with a Premium user, they can chat indefinitely (Subsidized Match). Chat between two Free users is locked.
- **Premium Subscription:** Unlocks chat initiation with any Match, priority search ranking, advanced filters (Visa, Income), read receipts, and a monthly allowance of Credits.
- **A-La-Carte Credits (Microtransactions):** Sold in packs. Users spend credits on high-intent actions:
  - **Super Interest:** Bypasses queues, triggers direct SMS/Email alert to the receiver.
  - **Contact Unlock:** View a Match's verified phone number or full Horoscope PDF.
  - **A/V Call Token:** Required to initiate an Amazon Chime call.

---

### **9. Success & Closure Module**

- Mark profile as "Engaged" / "Married".
- Testimonial collection and referral sharing.

---

### **10. Admin & Marketing Service**

Internal dashboard.
- **Data Strategy:** Queries an Aurora Read-Replica to aggregate cross-domain data without degrading production performance.
- **Features:** Push/Email campaigns, Segmentation, Moderation queue (flagged messages, manual verification fallbacks).

---

## **Phased Build Priority Order**

### **Phase 1 — Foundation & Identity (Weeks 1–5)**
- **Infrastructure (AWS CDK):** VPC, ALB, Fargate, Aurora, ElastiCache, S3.
- **CI/CD:** GitHub Actions to Firebase App Distribution.
- **Auth & Profile Modules:** Firebase integration, NestJS Auth Guards, Core profile schema.
- **Verification:** Work Email OTP & Selfie Liveness.

### **Phase 2 — Core Product Loop (Weeks 6–11)**
- **Discovery:** PostgreSQL text search and filter APIs.
- **Match Module:** Double opt-in logic.
- **Communication:** NestJS WebSockets chat integration.
- **Notifications:** Push and Email setup.

### **Phase 3 — Monetization & Trust Depth (Weeks 12–17)**
- **Subscriptions:** Stripe integration and gating logic.
- **Advanced Verification:** Textract OCR pipeline.
- **A/V Calls:** Amazon Chime integration.
- **Compliance:** Distributed Deletion Saga (GDPR/CCPA).

### **Phase 4 — Operations, Growth & Polish (Weeks 18–22)**
- **Admin Module:** Read-replica setup, moderation dashboards.
- **Performance:** X-Ray tracing, load testing.
- **Launch:** Play Store production release.
