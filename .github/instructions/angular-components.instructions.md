---
applyTo: "**/*.component.ts"
description: "Angular component coding standards and patterns"
---

# Angular Component Instructions

## Component Structure

Every component MUST follow this order:

1. Decorator (`@Component`)
2. Class declaration with `implements OnInit` (or other lifecycle hooks as needed)
3. Input signals / `@Input()` properties
4. Output signals / `@Output()` properties  
5. Public properties (signals, observables)
6. Private properties
7. Injected services (via `inject()`)
8. `ngOnInit()` and other lifecycle hooks
9. Public methods
10. Private methods

## Required Patterns

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {
  // Input signals (preferred) or decorator-based inputs
  public name = input.required<string>();
  public label = input<string>('default');

  // Output signals
  public saved = output<IUser>();

  // Internal signals
  protected readonly isLoading = signal(false);

  // Injected services
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    // initialization logic
  }
}
```

## Rules

- ALWAYS set `changeDetection: ChangeDetectionStrategy.OnPush`
- ALWAYS use `standalone: true`
- ALWAYS use `inject()` — never constructor injection
- Prefer signal-based inputs (`input()`, `input.required()`) over `@Input()` decorator
- Prefer signal-based outputs (`output()`) over `@Output()` + `EventEmitter`
- Use `computed()` for derived state
- Use `effect()` sparingly — prefer `computed()` and template expressions
- Prefix protected/template-accessible properties with no underscore
- Prefix private properties with underscore: `_subscription`
