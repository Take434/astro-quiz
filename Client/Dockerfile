FROM node:24.18.0-alpine AS base
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    pangomm-dev
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global corepack@latest

FROM base AS installer
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY ./Client .
ENV CI=true
RUN pnpm i --no-frozen-lockfile
RUN pnpm build

FROM caddy:2.11-alpine AS runner
WORKDIR /usr/src/app
COPY --from=installer /usr/src/app/Caddyfile /etc/caddy/Caddyfile
COPY --from=installer /usr/src/app/dist /srv
RUN ls /etc
EXPOSE 80 443
