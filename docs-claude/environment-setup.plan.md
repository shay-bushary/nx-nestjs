# Plan: Multi-Environment Debug Support (Nx fileReplacements)

## Goal
Enable running the NestJS app in `development`, `stage`, `production`, and `test` environments using Nx-managed TypeScript environment files with `fileReplacements`. VSCode dropdown picker selects which Nx configuration (and thus which environment file) to use when debugging.

## Approach
- Create `apps/nx-nest/src/environments/environment.ts` (default/dev) and per-env variants
- Use Nx `fileReplacements` in `project.json` build configurations to swap `environment.ts` at build time
- Add `stage` and `test` build/serve configurations alongside existing `development`/`production`
- VSCode `launch.json` uses `inputs` dropdown to pick the Nx configuration

---

### Phase 1: Create TypeScript Environment Files

**Assigned to**: senior-backend-engineer
**Date Started**: 2026-01-30
**Status**: [x] Completed

- [x] Create folder `apps/nx-nest/src/environments/`
- [x] Create `environment.ts` — default (development) config with `Environment` interface + exported object
- [x] Create `environment.development.ts` — explicit dev copy, imports interface from base
- [x] Create `environment.stage.ts` — stage config with `host: '0.0.0.0'`
- [x] Create `environment.production.ts` — reads from `process.env`, non-null assertion for jwtSecret
- [x] Create `environment.test.ts` — port 8081, short-lived tokens
- [x] All files export the same `Environment` interface/shape

#### Phase 1 Completion Report

| Question                                 | Response |
| ---------------------------------------- | -------- |
| What was implemented?                    | 5 environment TS files + Environment interface in environments/ folder |
| Were there any deviations from the plan? | No |
| Issues/blockers encountered?             | None |
| How were issues resolved?                | N/A |
| Any technical debt introduced?           | No |
| Recommendations for next phase?          | Proceed with Nx fileReplacements config |

**Completed by**: senior-backend-engineer
**Date Completed**: 2026-01-30

#### Notes for Future Phases

- `environment.ts` is the file imported in app code — Nx swaps it at build time
- Production file should read secrets from `process.env` (no hardcoded values)
- All files must export `environment` with the same shape

---

### Phase 2: Configure Nx fileReplacements & Build/Serve Configurations

**Assigned to**: senior-backend-engineer
**Date Started**:
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Update `project.json` build target — add `fileReplacements` to `production` configuration:
  ```json
  "fileReplacements": [{
    "replace": "apps/nx-nest/src/environments/environment.ts",
    "with": "apps/nx-nest/src/environments/environment.production.ts"
  }]
  ```
- [ ] Add `stage` build configuration with fileReplacement pointing to `environment.stage.ts`
- [ ] Add `test` build configuration with fileReplacement pointing to `environment.test.ts`
- [ ] `development` configuration — no fileReplacement needed (uses default `environment.ts`)
- [ ] Update `serve` target — add `stage` and `test` configurations mapping to their build targets:
  ```json
  "stage": { "buildTarget": "nx-nest:build:stage" },
  "test": { "buildTarget": "nx-nest:build:test" }
  ```
- [ ] Remove the commented-out fileReplacements from rspack.config.js (Nx handles it via project.json)

#### Phase 2 Completion Report

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

#### Notes for Future Phases

- `nx serve nx-nest -c stage` will build with stage env file swapped in
- Existing `nx serve nx-nest` defaults to `development` (no swap)

---

### Phase 3: Wire Environment into App Code

**Assigned to**: senior-backend-engineer
**Date Started**:
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Update `apps/nx-nest/src/main.ts` — import `environment` from `./environments/environment` and use `environment.port` instead of `process.env.PORT || 8080`
- [ ] Update `apps/nx-nest/src/auth/auth.module.ts` — use `environment.jwtSecret` / `environment.jwtAccessExpiry` instead of raw `process.env`
- [ ] Update `apps/nx-nest/src/auth/auth.service.ts` — same, use environment object
- [ ] Update `apps/nx-nest/src/auth/jwt.strategy.ts` — use `environment.jwtSecret`
- [ ] For production env file: values should still fallback to `process.env` so Docker/cloud can override at runtime

#### Phase 3 Completion Report

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

#### Notes for Future Phases

- All config now flows through `environment` object — single source of truth
- Production still reads `process.env` so Docker env vars work

---

### Phase 4: Update VSCode launch.json with Dropdown Picker

**Assigned to**: senior-backend-engineer
**Date Started**:
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Add `inputs` section with `pickString` for environment: `development`, `stage`, `production`, `test`
- [ ] Update debug configuration `runtimeArgs` to: `["nx", "serve", "@nx-workspace/nx-nest", "-c", "${input:environment}"]`
- [ ] Keep existing debug settings (sourceMaps, outFiles, inspect port)
- [ ] Dropdown appears on F5 — user picks env, Nx builds with correct fileReplacement

#### Phase 4 Completion Report

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

## Summary

| Phase | Description | Agent |
|-------|-------------|-------|
| 1 | Create TypeScript environment files | senior-backend-engineer |
| 2 | Configure Nx fileReplacements & build/serve configs | senior-backend-engineer |
| 3 | Wire environment object into app code | senior-backend-engineer |
| 4 | VSCode launch.json dropdown picker | senior-backend-engineer |

**Total phases**: 4
**New dependencies**: None
**Files created**: `apps/nx-nest/src/environments/environment.ts`, `environment.development.ts`, `environment.stage.ts`, `environment.production.ts`, `environment.test.ts`
**Files modified**: `apps/nx-nest/project.json`, `apps/nx-nest/src/main.ts`, `apps/nx-nest/src/auth/auth.module.ts`, `apps/nx-nest/src/auth/auth.service.ts`, `apps/nx-nest/src/auth/jwt.strategy.ts`, `.vscode/launch.json`
