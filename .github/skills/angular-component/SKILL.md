---
name: angular-component-scaffold
description: >
  Scaffold Angular components following project conventions. Use when asked to
  "create a component", "scaffold a component", "add a new component", or
  when building any new Angular component from scratch.
---

# Angular Component Scaffolding Skill

This skill scaffolds production-ready Angular components that follow our project's conventions.

## When to Use

- Creating any new Angular component (feature, shared, or layout)
- Migrating or rebuilding components from older Angular patterns

## Component Template

Every new component MUST include all of these files:

### TypeScript (`<name>.component.ts`)

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-<name>',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './<name>.component.html',
  styleUrl: './<name>.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <Name>Component {
  // -- Inputs --
  // public title = input.required<string>();

  // -- Outputs --
  // public closed = output<void>();

  // -- State --
  // protected readonly isLoading = signal(false);

  // -- Computed --
  // protected readonly displayTitle = computed(() => this.title().toUpperCase());

  // -- Services --
  // private readonly service = inject(MyService);
}
```

### Template (`<name>.component.html`)

```html
<div class="<name>">
  @if (isLoading()) {
    <app-spinner />
  } @else {
    <ng-content />
  }
</div>
```

### Styles (`<name>.component.scss`)

```scss
:host {
  display: block;
}

.<name> {
  &__header {}
  &__body {}
  &__footer {}
}
```

### Test (`<name>.component.spec.ts`)

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <Name>Component } from './<name>.component';

describe('<Name>Component', () => {
  let component: <Name>Component;
  let fixture: ComponentFixture<<Name>Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<Name>Component],
    }).compileComponents();

    fixture = TestBed.createComponent(<Name>Component);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Placement Rules

| Type | Location |
|------|----------|
| Feature component | `src/app/features/<feature>/components/<name>/` |
| Shared component | `src/app/shared/components/<name>/` |
| Layout component | `src/app/layouts/<name>/` |

## Validation

After scaffolding, run these checks:

```bash
# Verify the component compiles
npx ng build --configuration=development 2>&1 | head -20

# Run the component's tests
npx jest <path-to-spec> --verbose
```
