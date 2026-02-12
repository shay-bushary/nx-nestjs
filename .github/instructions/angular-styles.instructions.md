---
applyTo: "**/*.scss"
description: "SCSS styling standards with BEM"
---

# SCSS Styling Instructions

## BEM Convention

```scss
.user-card {
  &__header { /* element */ }
  &__body { /* element */ }
  &--active { /* modifier */ }
  &--disabled { /* modifier */ }
}
```

## Rules

- Use **BEM naming**: `.block__element--modifier`
- Use **component-scoped styles** (Angular's ViewEncapsulation.Emulated — the default)
- Use **SCSS variables** from the shared theme for colors, spacing, typography
- Import shared variables via `@use 'styles/variables' as vars;`
- Never use hardcoded colors — always reference theme variables
- Prefer `rem`/`em` over `px` for sizing
- Use **CSS custom properties** for theming when applicable
- Never use `!important` — fix specificity issues properly
- Keep nesting to a maximum of 3 levels deep
- Use `:host` selector for component-level styles
- Responsive: use shared breakpoint mixins, mobile-first approach
