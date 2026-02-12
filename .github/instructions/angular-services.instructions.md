---
applyTo: "**/*.service.ts"
description: "Angular service coding standards"
---

# Angular Service Instructions

## Service Structure

```typescript
@Injectable({
  providedIn: 'root', // or 'any' for feature-scoped
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  // State (if service manages local state)
  private readonly _users = signal<IUser[]>([]);
  public readonly users = this._users.asReadonly();

  // Public API methods with explicit return types
  public getUsers(): Observable<IUser[]> {
    return this.http.get<IApiResponse<IUser[]>>(`${this.apiUrl}/users`).pipe(
      map(response => response.data),
      catchError(this.handleError),
    );
  }
}
```

## Rules

- Use `providedIn: 'root'` for singleton services
- Always define explicit return types on public methods
- Keep HTTP logic in dedicated services — not in components
- Use generics for API response typing
- Handle errors using `catchError` and pipe operators
- Use `shareReplay(1)` for caching GET requests when appropriate
- Expose read-only signals for state: `asReadonly()`
- Prefix private signal state with underscore
- Add JSDoc comments on all public methods explaining purpose, params, and return
