# Stage 1: Build dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Final image
FROM node:20-alpine
WORKDIR /app

# Buat user non-root untuk keamanan
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies dari stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY src/ ./src/
COPY package.json ./

# Ganti kepemilikan ke user non-root
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]
