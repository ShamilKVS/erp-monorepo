# Build stage using Bun
FROM oven/bun:latest AS build
WORKDIR /app

# Copy lock & package files
COPY package.json bun.lock* ./

# Install & build
RUN bun install
COPY . .

# Use VITE_API_BASE_URL from environment if provided, otherwise use build arg
# This allows the env file to be used during build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN bun run build

# Production stage: serve static files
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
