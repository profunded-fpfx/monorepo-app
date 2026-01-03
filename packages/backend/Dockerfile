# Backend Dockerfile (NestJS)
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:24.11.1-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend package files
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @profunded/backend...

# Stage 2: Builder
FROM node:24.11.1-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules

# Copy source code
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend ./packages/backend

# Build the application
WORKDIR /app/packages/backend
RUN pnpm build

# Stage 3: Production
FROM node:24.11.1-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder --chown=nestjs:nodejs /app/packages/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/backend/package.json ./
COPY --from=deps --chown=nestjs:nodejs /app/packages/backend/node_modules ./node_modules

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]
