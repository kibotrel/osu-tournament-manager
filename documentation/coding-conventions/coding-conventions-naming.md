# Naming

To improve code readability and navigation, we should follow a consistent set of naming rules enforced across the codebase.

## General rules

The following applies to every section below.

- Acronyms and abbreviations related to business logic are prohibited. More broadly, they should be avoided to preserve clarity, though common ones like PDF, CSV, app, or conf may be acceptable depending on the context.
- Names must clearly convey meaning and context.

## Variables

Applies to all declarations using `let` or `const`.

- Always use [camelCase](https://developer.mozilla.org/docs/Glossary/Camel_case) except for [magic value constants](https://refactoring.guru/replace-magic-number-with-symbolic-constant) which must be written in [SCREAMING_SNAKE_CASE](https://en.wiktionary.org/wiki/screaming_snake_case).
- `Boolean` variables must be prefixed with binary-indicating words like `is`, `do`, or `should` . This is enforced by an `eslint` rule.

  ```ts
  // Bad
  const valid = someRule() || someOtherRule();

  // Good
  const areRulesValid = someRule() || someOtherRule();
  ```

- `Date` variables must be suffixed by `At`.

  ```ts
  // Bad
  const date = new Date('April 7, 2024');

  // Good
  const projectCreatedAt = new Date('April 7, 2024');
  ```

## Classes

Applies to all declarations using `class`.

- Must use [PascalCase](https://www.theserverside.com/definition/Pascal-case).
- Whenever possible, use singular form for names.
- Must be suffixed with the class purpose when applicable such as `Builder`, `Factory`, or `Strategy` for [design patterns](https://refactoring.guru/).

## Enums

Applies to all declarations using `enum`.

- Must use [PascalCase](https://www.theserverside.com/definition/Pascal-case).
- Enum names must be in singular form.
- Enum member keys must be also written in [PascalCase](https://www.theserverside.com/definition/Pascal-case).
- If enum values are strings, their casing must be consistent.
- If enum values are numbers, [use numeric separators](https://dev.to/suprabhasupi/numeric-separators-in-javascript-3jec) where appropriate.

```tsx
enum ExampleString {
  One = 'first_key',
  Two = 'second_key',
}

enum ExampleNumber {
  One = 1,
  OneThousand = 1_000,
  OneMillion = 1_000_000,
}
```

## Typescript interfaces & types

Applies to all declarations using the `interface` or `type` keywords.

- Must be written in [PascalCase](https://www.theserverside.com/definition/Pascal-case).
- Whenever possible, use singular names to allow creating array types from them.
- For interfaces, properties must be written in [camelCase](https://developer.mozilla.org/fr/docs/Glossary/Camel_case).
