---
description: "Refactor an Angular component from RxJS/imperative to signals pattern"
mode: agent
---

# Refactor to Angular Signals

Refactor the currently open component to use modern Angular signals:

## Migration Steps

1. Replace `@Input()` decorators with `input()` / `input.required()` signal functions
2. Replace `@Output()` + `EventEmitter` with `output()` signal function
3. Replace component-level `BehaviorSubject` / mutable state with `signal()`
4. Replace derived/computed observables with `computed()`
5. Replace `subscribe()` calls with `toSignal()` or `async` pipe in template
6. Add `DestroyRef` + `takeUntilDestroyed()` for any remaining subscriptions
7. Update template to call signals as functions: `{{ myValue() }}`
8. Update template to use `@if`/`@for`/`@switch` if not already
9. Ensure `ChangeDetectionStrategy.OnPush` is set
10. Run existing tests and fix any breakage

## Do NOT

- Remove RxJS from services — only refactor the component layer
- Change the component's external API (keep same selector, same behavior)
- Skip updating the tests
