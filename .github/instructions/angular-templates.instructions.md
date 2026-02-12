---
applyTo: "**/*.component.html"
description: "Angular template best practices"
---

# Angular Template Instructions

## Control Flow

Use the **new built-in control flow** syntax (Angular 17+). Do NOT use `*ngIf`, `*ngFor`, `*ngSwitch`.

```html
<!-- Conditional rendering -->
@if (isLoading()) {
  <app-spinner />
} @else if (error()) {
  <app-error-message [message]="error()" />
} @else {
  <div class="content">{{ data() }}</div>
}

<!-- Lists with trackBy -->
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
} @empty {
  <p>No users found.</p>
}

<!-- Switch -->
@switch (status()) {
  @case ('active') { <app-badge variant="success" /> }
  @case ('inactive') { <app-badge variant="warning" /> }
  @default { <app-badge variant="neutral" /> }
}
```

## Rules

- ALWAYS use `@if`, `@for`, `@switch` — never structural directives (`*ngIf`, `*ngFor`)
- ALWAYS provide `track` in `@for` loops
- ALWAYS provide `@empty` blocks for lists
- ALWAYS handle loading, error, and empty states
- Use signals directly in templates: `{{ mySignal() }}`
- Use `async` pipe for observables: `{{ data$ | async }}`
- Keep templates under 80 lines — extract child components
- Use `<ng-container>` to avoid extra DOM elements
- Accessibility: always include `aria-label`, `alt`, `role` where appropriate
- Never put business logic in templates — use component methods or computed signals
