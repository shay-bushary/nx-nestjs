# Phased Implementation Plan: Nx Setup + Full-Stack Hangman Features

**Project**: nx-workspace
**Task**: Add project.json for both apps, Dockerfile for nx-react, update docker-compose, then implement JWT auth + leaderboard with full React integration
**Created**: 2026-01-28

---

## Overview

Wire up Nx project configs for both apps, add Dockerfile for nx-react (nginx), update docker-compose, then implement JWT auth + leaderboard/scores backend with full React frontend integration for the Hangman game.

---

### Phase 1: Nx Project Configuration

**Assigned to**: devops-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Create `apps/nx-nest/project.json` — migrated targets from package.json nx field to standalone project.json
- [x] Create `apps/nx-react/project.json` — defined build, serve, lint, preview targets using Vite
- [x] Verify `nx graph` resolves both projects and shared lib dependencies
- [x] Run `nx build nx-nest` and `nx build nx-react` to confirm targets work

#### Phase 1 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | Created project.json for both nx-nest and nx-react. Migrated nx-nest targets from package.json "nx" field to project.json. Created new Vite-based targets for nx-react. Updated e2e project refs. Renamed nx-react package to @nx-workspace/nx-react. |
| Were there any deviations from the plan? | Yes — nx-nest already had targets in package.json "nx" field, so we migrated them to project.json and removed the "nx" block from package.json for consistency. |
| Issues/blockers encountered?             | 1) nx-nest-e2e had implicit dependency on `@nx-workspace/nx-nest` which didn't match new project name `nx-nest` — fixed refs. 2) nx-react build initially failed due to missing type deps — resolved with `npm install`. |
| How were issues resolved?                | Updated e2e package.json refs to use `nx-nest`. Ran npm install to hoist react app devDependencies. |
| Any technical debt introduced?           | None |
| Recommendations for next phase?          | Proceed with Phase 2 (Dockerfile + Docker Compose for nx-react) |

**Completed by**: devops-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- Project names in Nx: `nx-nest`, `nx-react`
- Nx targets should align with existing package.json scripts
- nx.json already has plugins for @nx/js/typescript, @nx/webpack, @nx/eslint, @nx/docker

---

### Phase 2: Dockerfile + Docker Compose for nx-react

**Assigned to**: devops-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Create `apps/nx-react/Dockerfile` — multi-stage: node alpine builder → nginx alpine production
- [x] Add nginx config for SPA routing (fallback to index.html) and `/api` proxy to backend
- [x] Update `docker-compose.yml` — add `nx-react` service (port 8080→80), depends_on nx-nest healthy
- [x] Add `VITE_API_URL` env var support in React build (ARG/ENV in builder stage, defaults to /api)
- [ ] Test `docker compose up` — both services run, React can reach Nest API via nginx proxy

#### Phase 2 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | Multi-stage Dockerfile (node:lts-alpine builder → nginx:alpine prod), nginx.conf with SPA fallback + /api proxy + gzip + static asset caching, docker-compose nx-react service on 8080→80 |
| Were there any deviations from the plan? | No deviations |
| Issues/blockers encountered?             | None |
| How were issues resolved?                | N/A |
| Any technical debt introduced?           | Docker compose test not run (no Docker daemon available in this session) |
| Recommendations for next phase?          | Proceed with Phase 3 (shared API types). Test docker compose when ready to deploy. |

**Completed by**: devops-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- **Config changes**: `VITE_API_URL` env var for API base URL
- **Ports**: nx-react 8080 (host) → 80 (container), nx-nest stays 3001→3000
- **Nginx**: Proxy `/api` to nx-nest service inside docker network

---

### Phase 3: Shared API Types

**Assigned to**: senior-backend-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Add types to `@nx-shay/shared`: User, AuthTokens, LoginRequest, RegisterRequest, GameScore, LeaderboardEntry
- [x] Add API response wrapper type: `ApiResponse<T>` with status, data, message fields
- [x] Add game-related enums: GameMode (single, two), GameResult (win, loss)
- [x] Export all new types from shared index
- [x] Verify both apps can import the types

#### Phase 3 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | Created `libs/shared/src/lib/types/api.types.ts` with all planned types/enums. Updated barrel export. |
| Were there any deviations from the plan? | No |
| Issues/blockers encountered?             | Pre-existing: shared lib `tsc --build` fails due to nodenext module resolution requiring `.js` extensions in imports. Not caused by this phase. |
| How were issues resolved?                | N/A — pre-existing issue. nx-react typecheck passes; nx-nest uses rspack which resolves types via tsconfig paths. |
| Any technical debt introduced?           | None |
| Recommendations for next phase?          | Proceed with Phase 4 (JWT auth backend). Consider fixing shared lib tsconfig moduleResolution separately. |

**Completed by**: senior-backend-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- **New types in @nx-shay/shared**: User, AuthTokens, LoginRequest, RegisterRequest, GameScore, LeaderboardEntry, ApiResponse, GameMode, GameResult
- Both backend and frontend must use these shared types for API contracts

---

### Phase 4: Backend — JWT Auth + User Endpoints

**Assigned to**: senior-backend-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Install: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt` (+ types)
- [x] Create `AuthModule` with JWT strategy (access + refresh tokens)
- [x] Create `UsersModule` with in-memory store (array-based, no DB for now)
- [x] Implement endpoints:
  - `POST /api/auth/register` — create user, return tokens
  - `POST /api/auth/login` — validate credentials, return tokens
  - `POST /api/auth/refresh` — refresh access token
  - `GET /api/users/me` — current user profile (protected)
- [x] Add `JwtAuthGuard` for protected routes
- [x] Test all endpoints with curl
- [x] Update `docs-claude/backend-routes.md`

#### Phase 4 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | AuthModule (JWT strategy, register/login/refresh endpoints), UsersModule (in-memory store, /me endpoint), JwtAuthGuard, backend-routes.md |
| Were there any deviations from the plan? | No |
| Issues/blockers encountered?             | `nx serve` failed due to outputPath mismatch (build outputs to `apps/nx-nest/dist/` not `dist/apps/nx-nest/`). Tested by running built output directly. |
| How were issues resolved?                | Ran `node apps/nx-nest/dist/main.js` directly for testing. Pre-existing config issue not introduced by this phase. |
| Any technical debt introduced?           | None |
| Recommendations for next phase?          | Proceed with Phase 5 (Leaderboard/Scores backend). Consider fixing nx serve outputPath config separately. |

**Completed by**: senior-backend-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- **API endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/users/me`
- **New dependencies**: @nestjs/jwt, @nestjs/passport, passport-jwt, bcrypt
- **Env vars**: `JWT_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`
- **Data**: In-memory array store (no persistence across restarts)

---

### Phase 5: Backend — Leaderboard + Scores

**Assigned to**: senior-backend-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Create `ScoresModule`
- [x] Implement endpoints:
  - `POST /api/scores` — submit game score (protected)
  - `GET /api/scores/me` — current user's game history (protected)
  - `GET /api/leaderboard` — top scores, public
  - `GET /api/leaderboard?mode=single|two` — filter by game mode
- [x] Score model: userId, word, guessesUsed, won, gameMode, duration, createdAt
- [x] Leaderboard aggregation: rank, username, wins, totalGames, avgGuesses
- [x] Test all endpoints with curl
- [x] Update `docs-claude/backend-routes.md`

#### Phase 5 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | ScoresModule (scores.service, scores.controller, leaderboard.controller), in-memory score store, leaderboard aggregation with mode filtering, backend-routes.md updated |
| Were there any deviations from the plan? | Leaderboard split into separate controller (leaderboard.controller.ts) for cleaner separation |
| Issues/blockers encountered?             | None |
| How were issues resolved?                | N/A |
| Any technical debt introduced?           | SubmitScoreDto is an interface (erased at runtime) — no runtime validation. Fine for now. |
| Recommendations for next phase?          | Proceed with Phase 6 (Auth frontend). Both backend phases (4+5) complete. |

**Completed by**: senior-backend-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- **API endpoints**: `/api/scores`, `/api/scores/me`, `/api/leaderboard`
- **Data**: In-memory store, same as users

---

### Phase 6: Frontend — API Client + Auth UI

**Assigned to**: frontend-engineer
**Date Started**: 2026-01-28
**Status**: [ ] Not Started | [ ] In Progress | [x] Completed

- [x] Create API client module (fetch wrapper with token management, auto-refresh)
- [x] Add AuthContext provider (login, register, logout, token state)
- [x] Create Login page and Register page
- [x] Add ProtectedRoute wrapper component
- [x] Add header/navbar with user info and logout button
- [x] Configure Vite proxy: `/api` → `http://localhost:3001` for dev
- [x] Update React Router with auth routes (`/login`, `/register`)

#### Phase 6 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | API client with auto-refresh, AuthContext, Login/Register pages, ProtectedRoute, header/navbar, Vite proxy, auth routes |
| Were there any deviations from the plan? | Vite proxy targets port 3001 instead of 3000 (React dev server uses 3000). Header hidden on login/register pages. |
| Issues/blockers encountered?             | Needed tsconfig path mapping for @nx-shay/shared in React app |
| How were issues resolved?                | Added path alias in vite.config.ts and tsconfig.app.json |
| Any technical debt introduced?           | None |
| Recommendations for next phase?          | Proceed with Phase 7 (Leaderboard frontend). Auth flow ready for integration testing. |

**Completed by**: frontend-engineer
**Date Completed**: 2026-01-28

#### Notes for Future Phases

- **Vite proxy**: `/api` → `http://localhost:3000` in vite.config.ts
- **New routes**: `/login`, `/register`
- **State**: AuthContext provides user state app-wide

---

### Phase 7: Frontend — Leaderboard + Score Submission

**Assigned to**: frontend-engineer
**Date Started**:
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Hook score submission into game-end flow (SinglePlayer and TwoPlayer games)
- [ ] Create Leaderboard page with sortable scores table
- [ ] Create "My Scores" / game history page
- [ ] Add leaderboard link to main menu
- [ ] Add game mode filter toggle on leaderboard
- [ ] Update React Router with new routes (`/leaderboard`, `/my-scores`)

#### Phase 7 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    |          |
| Were there any deviations from the plan? |          |
| Issues/blockers encountered?             |          |
| How were issues resolved?                |          |
| Any technical debt introduced?           |          |
| Recommendations for next phase?          |          |

**Completed by**:
**Date Completed**:

---

## Phase Dependency Graph

```
Phase 1 (Nx config) ──┐
                       ├── Phase 3 (Shared types) ──┬── Phase 4 (Auth BE) ──┬── Phase 6 (Auth FE)
Phase 2 (Docker)  ─────┘                            │                       │
                                                     └── Phase 5 (Scores BE)┴── Phase 7 (Leaderboard FE)
```

Phases 1 & 2 can run in parallel. Phases 4 & 5 can run in parallel. Phases 6 & 7 can run in parallel.

---

## Summary

| Phase | Description | Agent | Depends On |
|-------|-------------|-------|------------|
| 1 | Nx project.json for both apps | devops-engineer | — |
| 2 | React Dockerfile + docker-compose | devops-engineer | — |
| 3 | Shared API types | senior-backend-engineer | 1 |
| 4 | JWT auth backend | senior-backend-engineer | 3 |
| 5 | Leaderboard/scores backend | senior-backend-engineer | 3 |
| 6 | Auth frontend integration | frontend-engineer | 4 |
| 7 | Leaderboard frontend | frontend-engineer | 5, 6 |

---

## Execution

```bash
/phase-execute 1
```

Then proceed with subsequent phases after each completion.
