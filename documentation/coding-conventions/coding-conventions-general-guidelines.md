# General guidelines

To ensure high quality, low complexity, and easy maintenance, it is recommended to follow these recommendations.

## APIs

- Always prefer standard APIs (e.g., `crypto`, `fetch`, `Intl`) before writing custom code or using third-party dependencies.
- When consuming third-party APIs, use the [Adapter pattern](https://refactoring.guru/design-patterns/adapter) to prevent too much coupling, reducing impact if a contract change occurs.

  ```ts
  // Bad
  const someAPICall = () => {
    const response = await fetch('https://service.com/some/ressource')

    return await response.json()
  }

  // Good
  const someAPICall = () => {
    const response = await fetch('https://service.com/some/ressource')

    const data = await response.json()

    return {
      propertyOne: data.property_one
      reallyImportantStuff: data.property_two
    }
  }
  ```

## Performance

- When dealing with asynchronous and independent calls, prefer using `Promise.all`.

  ```ts
  // Bad
  await method1()
  await method2()
  ...
  await methodN()

  // Good
  const promises = [method1(), method2(), ..., methodN()]

  await Promise.all(promises)
  ```

> [!CAUTION]
> Keep in mind that while Promise.all is a great way to improve performance, it also has [some drawbacks](https://medium.com/@selieshjksofficial/reconsidering-promise-all-when-not-to-use-it-in-javascript-863cc8c20a19). Use it carefully.

- Avoid abstraction until necessary, occasional code repetition is acceptable.

## Function signature

- When a function has options, pass them as an object in the last parameter to allow adding more options later without changing parameter order

  ```ts
  // Bad
  export const getDataForUser = (userId, isAdmin, maxEntries) => {};

  getDataForUser(userId, true, 10);

  // Good
  export const getDataForUser = (userId, options) => {};

  getDataForUser(userId, { isAdmin: true, maxEntries: 10 });
  ```

## Navigation and readability

- To simplify file navigation, we group imports in the following order.
  - Node APIs, using `node:` protocol to avoid [typosquatting](https://www.nameshield.com/en/glossary/typosquatting/#:~:text=Typosquatting%20is%20a%20kind%20of,website%20than%20the%20one%20searched).
  - Third party packages
  - Local imports using aliases (e.g., `#src/services`, `#src/queries`)
  - Relative local imports (e.g., `../services`, `./utils`)

> [!TIP]
>
> Whenever possible, use import aliases instead of relative paths to reduce friction during refactoring. As a rule of thumb, use relative imports only for sibling, child, or parent files. Otherwise, use aliases.

- Sort everything alphabetically, when applicable like object keys, methods in a class or imports.
