FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package.json ../../
COPY ../../packages/shared/package.json ../../packages/shared/

# Install dependencies
RUN npm install

# Copy source
COPY . .
COPY ../../packages ../../packages

# Build
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY ../../package.json ../../
COPY ../../packages/shared/package.json ../../packages/shared/

# Install production dependencies
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/../../packages ../../packages

EXPOSE 3000

CMD ["npm", "start"]

