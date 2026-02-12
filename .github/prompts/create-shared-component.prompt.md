---
description: "Create a reusable shared Angular component with full documentation and tests"
mode: agent
---

# Create Shared Component

Scaffold a new reusable component under `src/app/shared/components/`.

## Component Details

- Name: ${input:componentName:Component name (kebab-case, e.g. data-table)}
- Purpose: ${input:purpose:What this component does}

## Generate

1. `src/app/shared/components/${componentName}/${componentName}.component.ts`
2. `src/app/shared/components/${componentName}/${componentName}.component.html`
3. `src/app/shared/components/${componentName}/${componentName}.component.scss`
4. `src/app/shared/components/${componentName}/${componentName}.component.spec.ts`

## Requirements

- Must be a **presentational (dumb) component**
- Must use signal-based `input()` and `output()`
- Must have `ChangeDetectionStrategy.OnPush`
- Must include JSDoc documentation on all inputs and outputs
- Must be fully accessible (ARIA attributes, keyboard support)
- Must include comprehensive unit tests
- Template must handle all states (loading, error, empty, populated)
- SCSS must use BEM naming and theme variables
