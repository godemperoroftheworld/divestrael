# ---- deps ----
FROM node:20-alpine AS builder
WORKDIR /app

ARG DIVESTRAEL_BACKEND_URL
ENV DIVESTRAEL_BACKEND_URL=${DIVESTRAEL_BACKEND_URL}
ARG API_KEY
ENV API_KEY=${API_KEY}
ARG IMAGE_TOKEN
ENV IMAGE_TOKEN=${IMAGE_TOKEN}

COPY . .

RUN corepack enable
RUN yarn install --frozen-lockfile

RUN chmod +x ./wait-and-build.sh
RUN ./wait-and-build.sh

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]