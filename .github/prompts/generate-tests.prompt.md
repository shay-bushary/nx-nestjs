---
description: "Generate comprehensive Jest unit tests for the current Angular file"
mode: agent
---

# Generate Unit Tests

Analyze the currently open file and generate a comprehensive `.spec.ts` test file.

## Process

1. Read the source file and identify all public methods, inputs, outputs, and dependencies
2. Create the spec file alongside the source file
3. Mock all injected dependencies
4. Write tests covering:
   - Component/service creation
   - Each public method (happy path)
   - Input/output bindings
   - Error and edge cases
   - Loading and empty states
   - User interactions (for components)
5. Run the tests to verify they pass: `npx jest <spec-file-path> --verbose`
6. Fix any failing tests

## Rules

- Use Jest, not Jasmine
- Follow Arrange-Act-Assert
- Use descriptive `describe` blocks and `it` names
- Mock everything external — no real HTTP, router, or service calls
- Use `jest.fn()` for mocks, `jest.clearAllMocks()` in `afterEach`
