FROM node:22.22.0-slim  AS base-image
ARG PNPM_VERSION=9.15.4
RUN npm --global install pnpm@${PNPM_VERSION}

FROM base-image AS install-dependencies
WORKDIR /osu-tournament-manager
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install-dependencies AS install-local-packages
WORKDIR /osu-tournament-manager/
COPY packages/tsconfig.json ./packages/
COPY packages/prettier-config ./packages/prettier-config/
COPY packages/shared ./packages/shared/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install-local-packages AS install-app
ARG PACKAGE
WORKDIR /osu-tournament-manager
COPY $PACKAGE ./$PACKAGE
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install-app AS dev
ARG PACKAGE
WORKDIR /osu-tournament-manager/${PACKAGE}
ENTRYPOINT ["/usr/local/bin/pnpm"]
CMD ["run", "dev"]
