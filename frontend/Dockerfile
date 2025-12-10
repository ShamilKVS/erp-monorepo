# Build stage using Bun
FROM oven/bun:latest AS build
WORKDIR /app

# Copy lock & package files
COPY package.json bun.lock* ./

# Install & build
RUN bun install
COPY . .
RUN bun run build

# Production stage: serve static files
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
