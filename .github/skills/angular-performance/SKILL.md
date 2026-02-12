---
name: angular-performance
description: >
  Optimize Angular application performance. Use when asked about
  "performance", "slow", "optimize", "bundle size", "lazy loading",
  "change detection", or when reviewing code for performance issues.
---

# Angular Performance Optimization Skill

This skill helps identify and fix performance issues in Angular applications.

## Performance Checklist

### Change Detection
- [ ] All components use `ChangeDetectionStrategy.OnPush`
- [ ] No `ChangeDetectorRef.detectChanges()` called manually (code smell)
- [ ] Signal-based state for automatic fine-grained reactivity
- [ ] No expensive computations in templates — use `computed()` signals

### Template Performance
- [ ] All `@for` loops have `track` expressions using unique identifiers
- [ ] No function calls in templates (use `computed()` or pipes instead)
- [ ] Large lists use virtual scrolling (`cdk-virtual-scroll-viewport`)
- [ ] Images use `NgOptimizedImage` directive with `priority` for LCP images

### Bundle Size
- [ ] All feature routes are lazy-loaded via `loadComponent` / `loadChildren`
- [ ] No large third-party libraries imported at root level
- [ ] Tree-shaking friendly imports (import specific functions, not entire libs)
- [ ] `@defer` blocks used for below-the-fold heavy components

### Network
- [ ] HTTP calls use `shareReplay(1)` for cacheable GET requests
- [ ] Proper `HttpInterceptor` caching strategy
- [ ] No duplicate API calls on navigation
- [ ] Pagination or infinite scroll for large data sets

### Memory Leaks
- [ ] All manual subscriptions cleaned up via `takeUntilDestroyed()`
- [ ] No event listeners without cleanup
- [ ] No timers (`setInterval`, `setTimeout`) without `clearInterval`/`clearTimeout`
- [ ] Signals preferred over observables in components

## Common Fixes

### Replace function calls in templates

```typescript
// ❌ Bad — called on every change detection cycle
getFullName(): string {
  return `${this.firstName} ${this.lastName}`;
}

// ✅ Good — computed only when dependencies change
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

### Add defer blocks for heavy components

```html
<!-- ✅ Load chart component only when visible -->
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder">Loading chart...</div>
}
```

### Virtual scrolling for large lists

```html
<cdk-virtual-scroll-viewport itemSize="48" class="list-viewport">
  <div *cdkVirtualFor="let item of items; trackBy: trackById" class="list-item">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

## Diagnostic Commands

```bash
# Analyze bundle size
npx ng build --configuration=production --stats-json
npx webpack-bundle-analyzer dist/<app>/stats.json

# Check for circular dependencies
npx madge --circular --extensions ts src/

# Run lighthouse audit (if using a dev server)
npx lighthouse http://localhost:4200 --output html --output-path ./lighthouse-report.html
```
