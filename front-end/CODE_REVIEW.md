# Frontend Code Review Suggestions

## Good practices

- Clean Next.js architecture with proper folder structure and page routing
- TypeScript strict mode with proper typing
- Types generated from Backends's GraphQL schema keeps it on sync
- UI component library (Mantine) for covering general components
- Custom react hooks to reuse logic (ex: useAuth, useDebounced)
- Proper separation of areas with services, hooks, and components
- Path aliases (import {Something} from "@/*") for clean imports 
- Testing setup with Vitest (modern and fast test lib)

## Security Issues

User inputs are not sanitized before display or submission

## Performance Optimizations

- Missing useMemo optimizations (ex: AuthContext.Provider) to avoid recreation on re-render

## Code Quality
- Inconsistent component declaration (Activity and Profile for ex)

Some magic strings found:
- Error messages: "Une erreur est survenue" (repeated many times)
- Routes are also repeated (ex: /profil)

They could be centralized in constants.

## Testing Improvements

- Only one component has tests
- No integration tests
- No E2E tests

## UX Improvements

- Accessibility issues, ex: missing aria labels

```typescript
<Button
  aria-label="Add activity to favorites"
  onKeyDown={handleKeyDown}
>
  Add to Favorites
</Button>
```

