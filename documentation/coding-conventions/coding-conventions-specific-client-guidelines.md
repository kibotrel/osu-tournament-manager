# Specific client guidelines

This document contains guidelines that only apply to the `@apps/client` directory.

## File structure

As already mentioned in [client architecture](../architecture/architecture-apps-client.md), the `@apps/client` directory is structured in a specific way. On top of that should be mentioned:

- There is a specific folder for icon SVGs in [`components/icons`](../../apps/client/src/components/icons/).
- All ore reusable components such as buttons, inputs etc. live in [`components/base`](../../apps/client/src/components/base/).
- The [`pages`](../../apps/client/src/pages/) directory should mirror the routing structure of the application.
  - Each route and sub-route should have its own folder
  - Inside each folder, there must be a `<Route>.page.vue` file that serves as the main component for that route.
  - There can be an optional `components` folder for components that are specific to that route and not reusable across the application. Components living in this folder should be named `<Route>.<Component>.vue`.

## Naming

- All [Vue Single File Components](https://vuejs.org/guide/scaling-up/sfc.html) should be named following a PascalCase dotted pattern `<ComponentName>.<componentType>.vue` where `<componentType>` is either `page` for page components or `component` for reusable components.
  - For components living in [`components`](../../apps/client/src/components/), the `<componentType>` can be `base`, `icon` or `mod` depending on the type of component.
- All composables should be named in camelCase and follow the pattern `use<Feature>.composable.ts`

## CSS

- Prioritize using Tailwind CSS utility classes for styling components. Only exception is in [`components/base`](../../apps/client/src/components/base/) where you can use Tailwind's `@apply` directive to create reusable classes for variants.
