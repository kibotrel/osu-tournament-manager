# Specific client guidelines

This document contains guidelines that only apply to the `@apps/client` directory.

## File structure

As already mentioned in [client architecture](../architecture/architecture-apps-client.md), the `@apps/client` directory is structured in a specific way. On top of that should be mentioned:

- There is a specific folder for icon SVGs in [`components/icons`](../../apps/client/src/components/icons/).
- All reusable components such as buttons, inputs etc. live in [`components/base`](../../apps/client/src/components/base/).
- The [`pages`](../../apps/client/src/pages/) directory should mirror the routing structure of the application.
  - Each route and sub-route should have its own folder
  - Inside each folder, there must be a `<Route>.page.vue` file that serves as the main component for that route.
  - There can be an optional `components` folder for components that are specific to that route and not reusable across the application. Components living in this folder should be named `<Route>.<ComponentName>.component.vue`.
- API functions and composables follow specific naming patterns to ensure consistency and clarity.

## Naming conventions by file type

All files in `@apps/client` follow a **lowercase dotted pattern** to ensure clarity and consistency across the codebase. This makes it easier to navigate and understand the purpose of each file at a glance.

### Vue Single File Components (SFCs)

All [Vue Single File Components](https://vuejs.org/guide/scaling-up/sfc.html) follow the pattern: `<fileName>.<componentType>.vue`

| Component Type     | Pattern                                    | Location                       | Examples                                                            |
| ------------------ | ------------------------------------------ | ------------------------------ | ------------------------------------------------------------------- |
| **Page**           | `<pageName>.page.vue`                      | `src/pages/`                   | `dashboard.page.vue`, `login.page.vue`, `match.page.vue`            |
| **Base Component** | `<componentName>.base.vue`                 | `src/components/base/`         | `badge.base.vue`, `button.base.vue`, `input.base.vue`               |
| **Page Component** | `<pageName>.<componentName>.component.vue` | `src/pages/<page>/components/` | `matches.chatHistory.component.vue`, `matches.drawer.component.vue` |
| **Icon**           | `<iconName>.icon.vue`                      | `src/components/icons/`        | `arrowPath.icon.vue`, `crown.icon.vue`, `loading.icon.vue`          |
| **Mod Component**  | `<modName>.mod.vue`                        | `src/components/mods/`         | `doubleTime.mod.vue`, `hardRock.mod.vue`, `noFail.mod.vue`          |

### TypeScript files

TypeScript files follow the pattern: `<fileName>.<fileType>.ts`

| File Type      | Pattern                          | Location           | Examples                                                            |
| -------------- | -------------------------------- | ------------------ | ------------------------------------------------------------------- |
| **API**        | `<apiName>.api.ts`               | `src/api/`         | `authentication.api.ts`, `matches.api.ts`                           |
| **Composable** | `use<FeatureName>.composable.ts` | `src/composables/` | `usePopUpBehavior.composable.ts`, `useScrollBehavior.composable.ts` |
| **Store**      | `<storeName>.store.ts`           | `src/stores/`      | `match.store.ts`, `user.store.ts`, `webSocket.store.ts`             |
| **Plugin**     | `<pluginName>.plugin.ts`         | `src/plugins/`     | `internationalization.plugin.ts`, `vueRouter.plugin.ts`             |
| **Constants**  | `<domainName>.constants.ts`      | `src/api/` or root | `api.constants.ts`                                                  |
| **Types**      | `<domainName>.types.ts`          | `src/types/`       | `webSockets.types.ts`                                               |

## CSS

- Prioritize using Tailwind CSS utility classes for styling components. Only exception is in [`components/base`](../../apps/client/src/components/base/) where you can use Tailwind's `@apply` directive to create reusable classes for variants.
