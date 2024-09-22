# Typescript Project Template

This includes a basic setup for a typescript project with all the scripts needed to develop, build, test and publish any package written in Typescript.

## :package: What's in the box ?

Aside of the obvious Typescript support, this template includes the following features:

- A strict Typescript configuration.
- A targeted node version (specified in `.nvmrc`).
- A Dependabot policy to keep dependencies up to date.
- [eslint](https://eslint.org/) with a strong configuration (mostly formatting and quality of life rules).
- [prettier](https://prettier.io/) to enforce a consistent code style.
- [vitest](https://vitest.dev/) to run tests.
- [nodemon](https://nodemon.io/) to speed up development.
- [commitlint](https://commitlint.js.org/) to enforce a consistent commit message style.
- [husky](https://typicode.github.io/husky/#/) to run scripts on git hooks.

## :rocket: Getting started

Once cloned, you can run the following commands:

- `pnpm install` installs all the dependencies, setup husky and commitlint git hooks.
- `nvm use` sets the node version to the one specified in `.nvmrc` (if you use [nvm](https://github.com/nvm-sh/nvm))
- `pnpm dev` starts a `nodemon` process and gets you ready to develop.
