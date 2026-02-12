---
name: angular-testing
description: >
  Write and improve Angular unit tests using Jest. Use when asked to
  "write tests", "add tests", "improve test coverage", "fix failing tests",
  or when working on any .spec.ts file.
---

# Angular Testing Skill

This skill generates high-quality Angular unit tests using Jest.

## Testing Patterns by File Type

### Component Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let mockService: jest.Mocked<MyService>;

  beforeEach(async () => {
    mockService = {
      getData: jest.fn().mockReturnValue(of([])),
      saveData: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<MyService>;

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MyService, useValue: mockService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load data on init', () => {
      fixture.detectChanges();
      expect(mockService.getData).toHaveBeenCalledOnce();
    });
  });

  describe('user interactions', () => {
    it('should emit save event when form is submitted', () => {
      const spy = jest.spyOn(component.saved, 'emit');
      // Act: trigger form submission
      // Assert
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'test' }));
    });
  });

  describe('error handling', () => {
    it('should display error message when API fails', () => {
      mockService.getData.mockReturnValue(throwError(() => new Error('API Error')));
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.error-message');
      expect(errorEl).toBeTruthy();
    });
  });
});
```

### Service Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService],
    });

    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch data', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockData });
  });
});
```

### Guard Tests

```typescript
describe('AuthGuard', () => {
  it('should allow access when authenticated', () => {
    const mockAuthService = { isAuthenticated: jest.fn().mockReturnValue(true) };
    const result = authGuard(mockRoute, mockState);
    expect(result).toBe(true);
  });
});
```

## Test Naming Convention

- `should [expected behavior] when [condition]`
- Examples:
  - `should display loading spinner when data is being fetched`
  - `should navigate to login when token is expired`
  - `should disable submit button when form is invalid`

## Running & Validating

```bash
# Run specific test file
npx jest src/app/features/user/components/user-list/user-list.component.spec.ts --verbose

# Run with coverage for a specific file
npx jest --collectCoverageFrom='src/app/features/user/**/*.ts' --coverage

# Run all tests
npx jest --verbose
```
