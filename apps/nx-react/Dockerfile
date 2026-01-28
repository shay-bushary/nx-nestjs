# Multi-stage Dockerfile for nx-react (fully isolated build)
# Build: docker-compose up --build
# Or: docker build -f apps/nx-react/Dockerfile -t nx-react .

# =============================================================================
# Stage 1: Builder - Install dependencies and build the application
# =============================================================================
FROM docker.io/node:lts-alpine AS builder

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy all workspace files needed for build
COPY tsconfig.base.json tsconfig.json nx.json ./
COPY libs ./libs
COPY apps ./apps

# Build arg for VITE_API_URL (defaults to /api for nginx proxy)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Sync workspace and build the nx-react app
RUN npx nx sync && npx nx build nx-react

# =============================================================================
# Stage 2: Production - Minimal nginx image to serve static files
# =============================================================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY apps/nx-react/nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/nx-react/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
