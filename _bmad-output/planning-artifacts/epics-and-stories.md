# Epics & Stories: Talambralu

## Overview
This document decomposes the Talambralu Modular Monolith architecture into implementable Epics and User Stories. The breakdown follows vertical slicing principles, ensuring that each slice delivers verifiable value.

---

## Epic 1: Foundation & Identity (Phase 1)
**Goal:** Establish the AWS infrastructure, CI/CD pipeline, and the core Authentication/Profile modules.

### Story 1.1: AWS Infrastructure Setup (CDK)
**Description:** Define and deploy the foundational AWS infrastructure using CDK.
**Acceptance Criteria:**
- [ ] VPC with public/private subnets is deployed.
- [ ] ECS Fargate cluster is active.
- [ ] Aurora PostgreSQL Serverless v2 instance is running and accessible from Fargate.
- [ ] S3 bucket for media is created.
**Verification:**
- [ ] `cdk deploy` succeeds.
- [ ] Manual check: Resources visible in AWS Console.

### Story 1.2: Base NestJS Application & CI/CD
**Description:** Initialize the NestJS Modular Monolith and set up GitHub Actions for automated deployment.
**Acceptance Criteria:**
- [ ] NestJS app runs locally.
- [ ] GitHub Action builds the Docker image and pushes to ECR.
- [ ] GitHub Action deploys the image to ECS Fargate.
**Verification:**
- [ ] Tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] CI pipeline passes on push to `main`.

### Story 1.3: Firebase Auth Integration
**Description:** Implement the Auth Module to validate Firebase JWTs and protect routes.
**Acceptance Criteria:**
- [ ] Firebase Admin SDK is configured in NestJS.
- [ ] Global `AuthGuard` validates incoming JWTs.
- [ ] Unauthenticated requests return 401 Unauthorized.
**Verification:**
- [ ] Unit tests for `AuthGuard` pass.
- [ ] Integration test: POST to a protected dummy route with valid/invalid tokens.

### Story 1.4: Base Profile Management
**Description:** Implement basic CRUD for user profiles.
**Acceptance Criteria:**
- [ ] `profiles` table is created in PostgreSQL.
- [ ] `POST /v1/profiles` creates a new profile linked to the Firebase UID.
- [ ] `GET /v1/profiles/me` returns the authenticated user's profile.
**Verification:**
- [ ] E2E tests for profile creation and retrieval pass.

---

## Epic 2: The Verification Pipeline
**Goal:** Implement the core "Trust Moat" features (OTP, Liveness, Textract).

### Story 2.1: S3 Upload & Image Handling
**Description:** Allow users to securely upload profile photos and verification documents to S3.
**Acceptance Criteria:**
- [ ] `GET /v1/upload/presigned-url` returns a short-lived S3 upload URL.
- [ ] Uploaded documents automatically trigger an SQS event.
- [ ] 14-day auto-delete lifecycle rule is applied to the verification bucket.
**Verification:**
- [ ] Integration test: Request URL, upload file, verify SQS message is queued.

### Story 2.2: Liveness Check (Rekognition)
**Description:** Process selfie uploads using Amazon Rekognition to verify liveness.
**Acceptance Criteria:**
- [ ] SQS consumer reads selfie upload events.
- [ ] Rekognition API is called to verify face liveness.
- [ ] Profile `is_face_verified` flag is updated based on the result.
**Verification:**
- [ ] Unit tests mocking Rekognition API.
- [ ] E2E test verifying database state update after successful liveness check.

### Story 2.3: Income Verification (Textract)
**Description:** Process paystub uploads using AWS Textract to extract income brackets.
**Acceptance Criteria:**
- [ ] SQS consumer reads paystub upload events.
- [ ] Textract API extracts relevant financial data.
- [ ] Profile `income_bracket_id` and `is_income_verified` are updated.
- [ ] Document is deleted from S3 upon successful extraction.
**Verification:**
- [ ] Unit tests mocking Textract output.

---

## Epic 3: Discovery & Matching
**Goal:** Enable users to find and express interest in each other.

### Story 3.1: Profile Search & Discovery
**Description:** Implement paginated search using PostgreSQL native text search.
**Acceptance Criteria:**
- [ ] `GET /v1/discovery` returns paginated profiles.
- [ ] Filters for age, gender, and verified badges are supported.
**Verification:**
- [ ] Database query tests using `tsvector` and `JSONB` filters.

### Story 3.2: Double Opt-In State Machine
**Description:** Implement the logic for sending, accepting, and declining interests.
**Acceptance Criteria:**
- [ ] `matches` table tracks state (PENDING, ACCEPTED, DECLINED).
- [ ] `POST /v1/interests` creates a PENDING match.
- [ ] `POST /v1/interests/:id/accept` updates state to ACCEPTED.
**Verification:**
- [ ] E2E tests covering the full state transition (Pending -> Accepted).

---

## Epic 4: Communication
**Goal:** Enable real-time chat between matched users.

### Story 4.1: WebSocket Infrastructure
**Description:** Set up NestJS WebSockets with Redis pub/sub for scalability.
**Acceptance Criteria:**
- [ ] WebSocket gateway authenticates users via Firebase JWT.
- [ ] Users can connect and join their respective match "rooms".
- [ ] Redis adapter is configured to route messages across Fargate instances.
**Verification:**
- [ ] Integration tests using WebSocket client.

### Story 4.2: Real-time Messaging
**Description:** Implement sending, receiving, and persisting chat messages.
**Acceptance Criteria:**
- [ ] Users can send text messages to ACCEPTED matches.
- [ ] Messages are persisted in PostgreSQL.
- [ ] `GET /v1/chat/messages/:matchId` returns paginated chat history.
**Verification:**
- [ ] E2E test: Send message via WS, verify it is returned by the GET endpoint.

---

## Epic 5: Monetization
**Goal:** Implement the Stripe integration to support the Hybrid Subscription and Credits model.

### Story 5.1: Stripe Webhook Infrastructure
**Description:** Set up a secure endpoint to receive and process Stripe webhooks.
**Acceptance Criteria:**
- [ ] `POST /v1/webhooks/stripe` endpoint is created.
- [ ] Webhook signatures are verified securely.
- [ ] Unhandled events are logged and return 200 OK.
**Verification:**
- [ ] Integration test using Stripe CLI to simulate webhook delivery.

### Story 5.2: Premium Subscription Gating
**Description:** Gate specific features based on the user's active Stripe subscription.
**Acceptance Criteria:**
- [ ] Profile model includes `subscription_tier` (FREE/PREMIUM).
- [ ] `SubscriptionGuard` restricts access to premium endpoints (e.g., advanced search filters).
- [ ] Webhook handler updates user tier on `checkout.session.completed` and `customer.subscription.deleted`.
**Verification:**
- [ ] E2E test: Accessing a premium route as a free user returns 403 Forbidden.

---

## Epic 6: Operations & Compliance
**Goal:** Implement tools for platform administration and ensure data privacy compliance.

### Story 6.1: GDPR Account Deletion Saga
**Description:** Implement the "Right to be Forgotten" by deleting user data across the DB and S3.
**Acceptance Criteria:**
- [ ] `DELETE /v1/profiles/me` removes the user record.
- [ ] PostgreSQL `ON DELETE CASCADE` removes all associated matches, messages, and interests.
- [ ] Deletion triggers an SQS event to a cleanup worker.
- [ ] Worker deletes all S3 objects (photos, docs) associated with the user ID.
**Verification:**
- [ ] Integration test: Delete user and verify DB is clean.
- [ ] E2E test: Verify S3 objects are deleted after SQS worker runs.

### Story 6.2: Admin API via Read-Replica
**Description:** Set up a separate database connection for heavy admin queries.
**Acceptance Criteria:**
- [ ] NestJS configures a secondary TypeORM/Prisma connection to the Aurora Read-Replica.
- [ ] `GET /v1/admin/stats` queries the replica without impacting primary DB performance.
- [ ] Endpoint is protected by an `AdminGuard`.
**Verification:**
- [ ] Integration test verifying the endpoint connects to the replica host.
