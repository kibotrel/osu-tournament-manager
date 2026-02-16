# Dependency management

First and foremost, it is important to know that we are using [pnpm](https://pnpm.io/) as our package manager. It is a fast and efficient alternative to npm and yarn, with a strong focus on performance and disk space optimization.

## When to use a dependency

In this project, third party dependencies are used to implement features in only two scenarios:

- To avoid mistakes on critical features such as security-related features.
- To avoid wasting time on complex features for which there are already battle-tested solutions available.

When adding a new dependency, if it does not fall into one of the above categories, it is recommended to implement the feature in-house instead. This helps to keep the codebase lean and reduce the risk of introducing bugs or security vulnerabilities through third-party code.

## How to use dependencies

There are only three rules to follow when using dependencies in this project:

- Always use a specific version, never use a range:
  ```jsonc
  {
    "dependencies": {
      "example-package": "1.2.3", // good
      "example-package": "^1.2.3", // bad
    },
  }
  ```
- Always update `pnpm-lock.yaml` and commit it after introducing a new dependency or updating an existing one. This ensures a reproducible build at all times.
- Regularly update dependencies to limit vulnerabilities exposure. [`dependabot`](../../.github/dependabot.yml) is set up to periodically check for updates and create pull requests when updates are available.
