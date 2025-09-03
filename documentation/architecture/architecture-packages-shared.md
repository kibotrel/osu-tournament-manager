# `@packages/shared`

This package contains code that can be used anywhere else in this monorepo without polyfill. It also contains types that act as the single source of truth when it comes to data structures and API contracts.

## 📁 Structure

- [`api`](../../packages/shared/src/api): Holds type safe fetch wrappers to make API calls.
- [`classes`](../../packages/shared/src/classes): Contains useful classes used throughout the application.
- [`constants`](../../packages/shared/src/constants): Here you could find core constants such as database enums or HTTP related stuff.
- [`methods`](../../packages/shared/src/methods): Bunch of helper function to parse, transform and format data.
- [`types`](../../packages/shared/src/types): Contains all the types and interfaces used throughout the application.
- [`validators`](../../packages/shared/src/validators): Utility type guards and validators to narrow down types and ensure data integrity.
