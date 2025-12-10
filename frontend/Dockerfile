# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock* package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code and configuration files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from build stage
COPY --from=build /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

