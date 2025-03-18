FROM node:18-alpine AS base

# Multi-stage build process for a Next.js application in a monorepo structure

# Stage 1: Builder - Prepare the workspace and prune dependencies
FROM base AS builder
# Alpine Linux requires libc6-compat for Node.js
RUN apk update && \
    apk add --no-cache libc6-compat

WORKDIR /app
RUN yarn global add turbo

# Copy all source files
COPY . .

# Use Turborepo to prune workspace to only landing app dependencies
RUN turbo prune landing --docker

# Stage 2: Installer - Install dependencies and build the application
FROM base AS installer
RUN apk update && \
    apk add --no-cache libc6-compat && \
    yarn global add turbo
WORKDIR /app

# Copy dependency configurations from builder
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/turbo.json ./turbo.json

# Install dependencies including required PostCSS tools
RUN yarn install && \
    yarn workspace landing add -D autoprefixer postcss

# Copy source code
COPY --from=builder /app/out/full/ .

# Configure build environment
# Remote caching configuration (disabled by default)
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

ARG NODE_ENV
ENV NODE_ENV="production"

# Build the application
RUN turbo build

# Stage 3: Runner - Production runtime environment
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

# Copy built application
# Using Next.js output traces for optimized production bundle
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/public ./apps/landing/public

# Start the application
CMD ["node", "apps/landing/server.js"]