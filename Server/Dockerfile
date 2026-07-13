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
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY ./Server .
ENV CI=true
RUN pnpm i --frozen-lockfile
RUN pnpm build

FROM node:24.18.0-alpine AS runner
WORKDIR /usr/src/app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/package.json .
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/dist ./dist
CMD node /usr/src/app/dist/index.js
EXPOSE 3000
