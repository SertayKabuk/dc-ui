# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
COPY src/db ./db/
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run prebuild
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/db ./db

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Start the application
CMD ["node", "server.js"]