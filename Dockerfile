FROM node:20.17.0-slim AS base
ARG PNPM_VERSION=9.11.0
RUN npm --global install pnpm@${PNPM_VERSION}

FROM base AS install
ARG APP
WORKDIR /osu-tournanament-manager
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY apps/tsconfig.json ./apps/
COPY packages/tsconfig.json ./packages/
COPY packages/shared /osu-tournanament-manager/packages/shared
COPY $APP ./$APP
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install AS dev
ARG APP
WORKDIR /osu-tournanament-manager/${APP}
USER node
ENTRYPOINT ["/usr/local/bin/pnpm"]
CMD ["run", "dev"]
