FROM node:20.13.1-slim AS base
ARG PNPM_VERSION=8.15.6
RUN npm --global install pnpm@${PNPM_VERSION}

FROM base AS install
ARG APP
WORKDIR /osu-tournanament-manager
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY apps/tsconfig.json ./apps/
COPY $APP ./$APP
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install AS dev
ARG APP
WORKDIR /osu-tournanament-manager/${APP}
USER node
ENTRYPOINT ["/usr/local/bin/pnpm"]
CMD ["run", "dev"]
