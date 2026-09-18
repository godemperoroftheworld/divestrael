FROM node:22-alpine AS deps
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml* ./

RUN yarn install --frozen-lockfile --immutable

FROM deps AS build
COPY . .

RUN yarn prebuild
RUN yarn build

FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV API_HOST=0.0.0.0

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

EXPOSE ${API_PORT}

CMD ["node", "dist/index.js"]