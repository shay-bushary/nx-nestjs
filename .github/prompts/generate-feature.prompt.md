---
description: "Scaffold a new Angular feature with component, service, model, routes, and tests"
mode: agent
---

# Generate Angular Feature

Create a complete Angular feature module with the following structure:

## Requirements

- Feature name: ${input:featureName:Feature name (kebab-case, e.g. user-management)}
- Description: ${input:featureDescription:Brief description of the feature}

## Generate These Files

Under `src/app/features/${featureName}/`:

1. **Routes**: `${featureName}.routes.ts` — lazy-loaded route config
2. **Container Component**: `components/${featureName}-page/${featureName}-page.component.ts` — smart component
3. **Template**: `components/${featureName}-page/${featureName}-page.component.html`
4. **Styles**: `components/${featureName}-page/${featureName}-page.component.scss`
5. **Service**: `services/${featureName}.service.ts` — HTTP and business logic
6. **Models**: `models/${featureName}.model.ts` — TypeScript interfaces
7. **Tests**: spec files for component and service

## Rules

Follow all conventions from the project's `copilot-instructions.md`:
- Standalone components with OnPush change detection
- `inject()` for dependencies
- Signal-based inputs/outputs
- New control flow syntax in templates (`@if`, `@for`)
- Jest for tests
- SCSS with BEM
- Proper path aliases
