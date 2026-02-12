---
applyTo: "**/store/**/*.ts"
description: "NgRx state management patterns"
---

# NgRx Store Instructions

## File Structure per Feature

```
store/
├── <feature>.actions.ts
├── <feature>.reducer.ts
├── <feature>.selectors.ts
├── <feature>.effects.ts
└── <feature>.state.ts     # Interface + initial state
```

## Actions

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User Page',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: IUser[] }>(),
    'Load Users Failure': props<{ error: string }>(),
  },
});
```

## Reducer

```typescript
export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
```

## Selectors

```typescript
export const selectUserState = createFeatureSelector<IUserState>('user');
export const selectUsers = createSelector(selectUserState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUserState, (state) => state.loading);
```

## Rules

- Use `createActionGroup` for related actions
- Always model loading/error/data triplet in state
- Use `createFeatureSelector` + `createSelector` for selectors
- Effects: use `createEffect` with `Actions` + `ofType`
- Never dispatch actions from effects to the same action (infinite loops)
- Prefer `concatLatestFrom` over `withLatestFrom` for store selectors in effects
- Use `provideState()` and `provideEffects()` in route-level providers for lazy loading
