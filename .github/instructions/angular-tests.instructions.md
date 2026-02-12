---
applyTo: "**/*.spec.ts"
description: "Angular unit testing standards with Jest"
---

# Angular Testing Instructions

## Testing Framework

- Use **Jest** (not Jasmine/Karma)
- Use `@testing-library/angular` for component tests when possible
- Use `jest-auto-spies` or manual mocks for service dependencies

## Component Test Structure

```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: jest.Mocked<UserService>;

  beforeEach(async () => {
    userServiceSpy = {
      getUser: jest.fn().mockReturnValue(of(mockUser)),
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialized', () => {
    it('should load user data', () => {
      fixture.detectChanges();
      expect(userServiceSpy.getUser).toHaveBeenCalledOnce();
    });
  });
});
```

## Rules

- Follow **Arrange-Act-Assert** pattern
- Use `describe` blocks to group related tests
- Use descriptive test names: `it('should display error message when API fails')`
- Mock all external dependencies — never make real HTTP calls
- Test component behavior, not implementation details
- Always test: creation, inputs/outputs, user interactions, edge cases, error states
- Use `fixture.detectChanges()` explicitly — do not auto-detect
- For services: test the public API, mock `HttpClient` using `HttpClientTestingModule`
- Aim for meaningful coverage, not 100% line coverage
