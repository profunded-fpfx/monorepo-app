# Backend Dockerfile (NestJS)
# Simplified approach that keeps the monorepo structure

# Stage 1: Dependencies
FROM node:24.11.1-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend package.json
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @profunded/backend...

# Stage 2: Builder
FROM node:24.11.1-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Copy dependencies
COPY --from=deps /app ./

# Copy backend source
COPY packages/backend ./packages/backend

# Build
WORKDIR /app/packages/backend
RUN pnpm build

# Stage 3: Production
FROM node:24.11.1-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy workspace files
COPY --from=deps --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=deps --chown=nestjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps --chown=nestjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy backend package.json
COPY --from=deps --chown=nestjs:nodejs /app/packages/backend/package.json ./packages/backend/package.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile --filter @profunded/backend... --prod

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/packages/backend/dist ./packages/backend/dist

# Switch to non-root user
USER nestjs

# Set working directory
WORKDIR /app/packages/backend

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]
