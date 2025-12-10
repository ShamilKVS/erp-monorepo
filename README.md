# ERP-POS Monorepo

A comprehensive Enterprise Resource Planning (ERP) and Point of Sale (POS) system built with modern technologies. This monorepo contains a Spring Boot backend API and a React frontend application, fully containerized with Docker.

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)

---

## 🌐 Live Demo

Check out the live demo of the application:

🔗 **[https://erp-monorepo-1.onrender.com](https://erp-monorepo-1.onrender.com)**

> **Note:** The demo is hosted on Render's free tier, so it may take a few seconds to wake up on first visit.

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📋 Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [API Documentation](#-api-documentation)
- [Docker Commands](#-docker-commands)
- [Environment Variables](#-environment-variables)
- [Database](#-database)

---

## 📸 Screenshots

| Login | Dashboard |
|:-----:|:---------:|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Create Sale | Sales History |
|:-----------:|:-------------:|
| ![Create Sale](docs/screenshots/create-sale.png) | ![Sales History](docs/screenshots/sales-history.png) |

---

## ✨ Features

### Core Modules
- **🔐 Authentication & Authorization** - JWT-based secure authentication with role-based access control
- **📦 Product Management** - Full CRUD operations for product inventory
- **💰 Sales Management** - Create, track, and manage sales transactions
- **📊 Reporting** - Generate PDF reports and sales summaries
- **📈 Dashboard** - Real-time business insights and analytics

---


## 🛠 Tech Stack

### Backend
- **Java 17** | **Spring Boot 3.2.0** | **PostgreSQL 16**

### Frontend
- **React 19** | **TypeScript 5.9** | **Vite 7.x** | **Tailwind CSS 4.x**

### DevOps
- **Docker & Docker Compose** | **Nginx** | **Bun**

---


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (includes Docker Engine and Docker Compose)
  - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

For local development without Docker:
- **Java 17** - [Eclipse Temurin](https://adoptium.net/) or [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 20+** or **Bun** - [Node.js](https://nodejs.org/) | [Bun](https://bun.sh/)
- **PostgreSQL 16** - [PostgreSQL](https://www.postgresql.org/download/)

---

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShamilKVS/erp-monorepo.git
   cd erp-monorepo
   ```

2. **Start all services**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080/api
   - **Swagger UI**: http://localhost:8080/api/swagger-ui.html
   - **API Docs**: http://localhost:8080/api/api-docs
   - **Default Login**: Username: `admin` | Password: `admin123`

4. **Stop all services**
   ```bash
   docker-compose down
   ```

> **⚠️ Note:** For simplicity, database credentials, passwords, and JWT secret key are hardcoded directly in the `.properties` files. This approach is acceptable for learning and development purposes only. **In production environments, always store sensitive data in environment variables or a secure secrets management system.**

---

## 💻 Development Setup

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Create database
   createdb erp_test
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will be available at `http://localhost:8080/api`

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Start development server**
   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   bun run build
   ```

The frontend will be available at `http://localhost:5173` with hot reload enabled.

---

## 📖 API Documentation

### Swagger UI
Interactive API documentation is available at:
- **Local**: http://localhost:8080/api/swagger-ui.html
- **Docker**: http://localhost:8080/api/swagger-ui.html


## 🐳 Docker Commands

### Basic Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# Restart all services
docker-compose restart
```

---

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable | Default                | Description |
|----------|------------------------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod`                 | Active Spring profile |
| `SPRING_DATASOURCE_URL` | -                      | Database JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | -                      | Database username |
| `SPRING_DATASOURCE_PASSWORD` | -                      | Database password |
| `JWT_SECRET` | (base64 encoded)       | JWT signing secret |
| `JWT_EXPIRATION` | `86400000`             | JWT expiration (ms) |
| `SERVER_PORT` | `8080`                 | Server port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:300` | Allowed CORS origins |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Backend API base URL |

---

### Database Migrations

Flyway handles database migrations automatically on application startup.

Migration files are located at: `backend/src/main/resources/db/migration/`

| Migration | Description |
|-----------|-------------|
| `V1__Initial_schema.sql` | Initial database schema |

---

## 🔒 Security

- **Authentication**: JWT-based token authentication
- **Password Storage**: BCrypt hashing
- **CORS**: Configurable allowed origins
- **API Security**: Spring Security with role-based access

### Default Credentials (Development Only)

> ⚠️ **Warning**: Change these credentials in production!

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

Check the seed data migration (`V2__Seed_data.sql`) for additional user credentials.

---

## 📦 Building for Production

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
# JAR file will be at target/erp-pos-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
# or
bun run build
# Static files will be in dist/
```

### Docker Images

```bash
# Build all images
docker-compose build

# Build specific image
docker-compose build backend
docker-compose build frontend
```

---


