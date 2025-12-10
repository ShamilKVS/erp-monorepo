# Build stage using Bun
FROM jarredsumner/bun:latest AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies with Bun
RUN bun install

# Copy source code
COPY . .

# Build React app (assuming you have a build script)
RUN bun run build

# Production stage: serve with Nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
