# Features

Each subfolder is a self-contained domain slice. Phase 1 leaves this empty.

## Convention

A feature folder owns everything specific to that feature:

```
src/features/<feature>/
├── components/        # feature-specific React components
├── services/          # business logic (pure functions where possible)
├── schema.ts          # Drizzle table(s) for this feature
├── types.ts           # types exported by this feature
└── index.ts           # public surface (the only file other features import from)
```

## Rules

- Features may import from `@/lib/*` and `@/components/ui/*`.
- Features must **not** import from another feature's internals — only from its `index.ts`.
- `@/lib/*` and `@/components/ui/*` must **not** import from `@/features/*`.

These rules keep `lib/` and `ui/` reusable and prevent feature tangling.
