FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package.json ../../
COPY ../../packages/foundation/package.json ../../packages/foundation/
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

# Copy package files
COPY package*.json ./
COPY ../../package.json ../../
COPY ../../packages/foundation/package.json ../../packages/foundation/
COPY ../../packages/shared/package.json ../../packages/shared/

# Install production dependencies
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/../../packages ../../packages

EXPOSE 4000

CMD ["node", "dist/main.js"]

