---
project_name: 'Talambralu'
user_name: 'Kilari'
date: '2026-05-17'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 21
optimized_for_llm: true
existing_patterns_found: 10
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

*   **Backend Monolith**: NestJS (v11.0.1), TypeScript (v5.7.3)
*   **Infrastructure**: AWS CDK (v2.1121.0), TypeScript (~5.9.3)
*   **Database ORM**: Prisma (v6.19.3), PostgreSQL
*   **AWS Services via SDK v3**: S3, SQS, Rekognition, Textract (v3.104x.x)
*   **Identity**: Firebase Admin SDK (v13.9.0)

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)
*   **Strict Typing**: Ensure all interfaces are fully typed. Do not bypass the type system.
*   **Path Aliases**: Utilize TypeScript paths if configured in `tsconfig.json` (avoid relative hell).
*   **Decorators**: Rely heavily on NestJS decorators for routing, guards, and injection.

### Framework-Specific Rules (NestJS)
*   **Modular Monolith Boundaries**: Modules (Auth, Profile, Verification, Match, Communication, Subscription) must remain logically isolated. Cross-module database joins are strictly forbidden. Use NestJS Services for synchronous inter-module communication.
*   **Event-Driven Pipeline**: SQS workers orchestrate the verification moat (Upload -> SQS -> Textract -> DB State).
*   **Global Guards**: `FirebaseAuthGuard` is applied globally. Use `@Public()` decorator to bypass authentication.

### Testing Rules
*   **E2E Testing**: Backend uses Jest with Supertest (`test/app.e2e-spec.ts`, etc.). Ensure new endpoints are covered.
*   **CDK Testing**: Infrastructure tests use Jest (`infra/test/infra.test.ts`). Verify stack synthesizes correctly.

### Code Quality & Style Rules
*   **Prisma Mapping**: Prisma schema uses `snake_case` for database mapping (e.g., `@map("user_id")`) but camelCase in TypeScript. Use `@db.Uuid` for ID fields.
*   **Linting**: Strict ESLint + Prettier enforcement via `npm run format` and `npm run lint`.
*   **Error Responses**: Consistent JSON error format required: `{ "error": { "code": "...", "message": "...", "details": {...} } }`.

### Development Workflow Rules
*   **BMAD Sequence**: Implementation is sequenced via BMAD Sprints (Sprint 1-4). Follow the dependency graph in `sprint-status.md`.
*   **No Direct DB Commits in Services**: Ensure data sovereignty; a module only writes to its own tables.
*   **AWS Free Tier Constraint**: RDS is temporarily downgraded to `t3.micro`. Must plan for Aurora Serverless v2 upgrade before launch.

### Critical Don't-Miss Rules
*   **Anti-Pattern**: Do NOT implement cross-module SQL joins.
*   **Anti-Pattern**: Do NOT commit AWS SDK clients inside controllers; encapsulate in dedicated services.
*   **Match State Machine**: Chat can ONLY be initiated if a `match` record exists between `user_a_id` and `user_b_id`.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-05-17
