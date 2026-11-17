# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client vào src/generated/prisma (theo schema output path)
RUN npx prisma generate

# Build NestJS (tsc compile src/ + src/generated/ → dist/)
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ dist (đã bao gồm dist/src/generated/prisma từ tsc)
COPY --from=builder /app/dist ./dist

# Copy prisma schema (cần cho runtime query engine)
COPY --from=builder /app/prisma ./prisma

# Copy node_modules/.prisma (native query engine binary)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8080

CMD ["node", "dist/src/main.js"]
