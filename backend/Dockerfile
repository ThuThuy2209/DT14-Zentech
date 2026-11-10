# NestJS 12 + Node.js + Prisma 7

FROM node:22-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source
COPY . .

# Build NestJS
RUN npm run build

# Production environment
ENV NODE_ENV=production
ENV PORT=8080

# Backend API port
EXPOSE 8080

# Start backend
CMD ["npm", "run", "start:prod"]
