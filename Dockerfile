# ---------------------------------------------------------------------------
# barkERP — Cloud Run için üretim imajı
# Çok aşamalı derleme: son imaj yalnızca çalıştırmak için gerekenleri içerir.
# ---------------------------------------------------------------------------

# --- 1) Bağımlılıklar ------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Prisma'nın Alpine üzerinde ihtiyaç duyduğu kütüphane
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# --- 2) Derleme ------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Derleme sırasında veritabanına BAĞLANILMAZ; Prisma yalnızca geçerli bir
# bağlantı biçimi bekler. Gerçek değerler çalışma anında verilir.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
ENV AUTH_SECRET="build-time-placeholder-not-used-at-runtime"

RUN npm run build

# --- 3) Çalıştırma ---------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run PORT değişkenini kendisi verir; varsayılan 8080.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma sorgu motoru ve üretilmiş istemci
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
