# Web Dockerfile (Next.js)
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:24.11.1-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy web package files
COPY packages/web/package.json ./packages/web/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @profunded/web...

# Stage 2: Builder
FROM node:24.11.1-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules

# Copy source code
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/web ./packages/web

# Set environment variables for Next.js build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
WORKDIR /app/packages/web
RUN pnpm build

# Stage 3: Production
FROM node:24.11.1-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy necessary files
COPY --from=builder /app/packages/web/next.config.ts ./
COPY --from=builder /app/packages/web/package.json ./
COPY --from=builder /app/packages/web/public ./public

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
