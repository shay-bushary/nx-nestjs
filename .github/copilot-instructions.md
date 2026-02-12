# Copilot Instructions

## Project Overview

This is an Angular enterprise application. All code MUST be written in Angular using TypeScript. Do NOT suggest React, Vue, Svelte, or any other framework.

## Tech Stack

- **Framework**: Angular (latest stable)
- **Language**: TypeScript (strict mode)
- **Styling**: SCSS with BEM naming convention
- **State Management**: NgRx (signals-based where applicable)
- **Testing**: Jest for unit tests, Cypress for e2e
- **Package Manager**: pnpm
- **Linting**: ESLint with Angular-specific rules
- **Formatting**: Prettier

## Architecture & Patterns

- Follow **standalone components** (no NgModules unless wrapping legacy code)
- Use **Angular signals** for reactive state in components
- Use the **smart/dumb component pattern**: container components handle logic, presentational components handle display
- Use **OnPush change detection** on every component
- Prefer **functional guards, resolvers, and interceptors** (not class-based)
- Use **inject()** function instead of constructor injection
- Use **Angular Router** with lazy-loaded routes via `loadComponent` / `loadChildren`
- Follow the **single responsibility principle** — one component, one purpose

## File & Folder Structure

```
src/app/
├── core/           # Singleton services, interceptors, guards, app-wide providers
├── shared/         # Shared components, directives, pipes (standalone, reusable)
├── features/       # Feature modules (lazy-loaded routes)
│   └── <feature>/
│       ├── components/    # Feature-specific components
│       ├── services/      # Feature-specific services
│       ├── models/        # Interfaces and types
│       ├── store/         # NgRx feature state (if applicable)
│       └── <feature>.routes.ts
├── layouts/        # Layout components (shell, sidebar, header)
└── app.routes.ts   # Root route configuration
```

## Naming Conventions

- Files: `kebab-case` → `user-profile.component.ts`, `auth.guard.ts`
- Classes: `PascalCase` → `UserProfileComponent`, `AuthGuard`
- Interfaces: `PascalCase` prefixed with `I` → `IUser`, `IApiResponse<T>`
- Services: `PascalCase` with `Service` suffix → `UserService`
- Selectors: prefix with `select` → `selectUserList`
- Actions: `[Source] Description` → `[User Page] Load Users`
- Component selectors: `app-<name>` → `app-user-profile`
- Enums: `PascalCase` → `UserRole`, `HttpStatusCode`

## Code Style Rules

- Always use **explicit return types** on public methods
- Always use **explicit access modifiers** (public, private, protected)
- Use `readonly` for injected dependencies and immutable properties
- Prefer **template-driven forms** for simple forms, **reactive forms** for complex forms
- Use `trackBy` with `@for` blocks
- Use **async pipe** or **toSignal()** — never manually subscribe in components
- Unsubscribe properly using `DestroyRef` + `takeUntilDestroyed()` when manual subscription is unavoidable
- Keep component TypeScript files under 200 lines; extract logic into services
- Keep templates under 80 lines; extract into child components
- Always handle loading, error, and empty states in templates

## API & HTTP

- Use a centralized `ApiService` that wraps `HttpClient`
- API base URLs come from `environment.ts`
- Use **HttpInterceptors** for auth tokens, error handling, and request/response logging
- Define API response types with generics: `IApiResponse<T>`

## Error Handling

- Use a global `ErrorHandler` for uncaught errors
- HTTP errors should be caught in interceptors and surfaced via a `NotificationService`
- Always log errors with contextual information

## Imports

- Use **path aliases** (`@core/`, `@shared/`, `@features/`, `@env/`) — never relative paths beyond `../`
- Group imports: Angular core → third-party → project modules

## Comments & Documentation

- Add JSDoc comments on all public service methods
- Add `@Input()` / `@Output()` descriptions on reusable components
- Do NOT add trivial comments like `// constructor` or `// imports`

## Git Commit Messages

- Format: `<type>(<scope>): <short description>`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`
- Example: `feat(user): add profile avatar upload`
