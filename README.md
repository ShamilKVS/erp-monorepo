# ERP Monorepo

A full-stack ERP/POS system with Spring Boot backend and React frontend.

## 🚀 Quick Start with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine and Docker Compose)

### Build and Run Everything

From the root directory, run a single command:

```bash
docker-compose up --build
```

This will:
- ✅ Build the backend (Spring Boot + Java 17)
- ✅ Build the frontend (React + Vite + TypeScript)
- ✅ Start PostgreSQL database
- ✅ Start all services with proper networking and health checks

### Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api/swagger-ui.html
- **Database**: localhost:5433 (PostgreSQL)

### Useful Docker Commands

```bash
# Start all services (build if needed)
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Rebuild specific service
docker-compose up --build backend

# Restart a service
docker-compose restart backend
```

## 📁 Project Structure

```
erp-monorepo/
├── backend/              # Spring Boot application
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/             # React + Vite application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml    # Orchestrates all services
```

## 🛠️ Development

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Default Credentials

**Database:**
- Host: localhost:5433
- Database: erp_pos
- Username: postgres
- Password: postgres

## 📝 Notes

- The frontend proxies API requests to the backend automatically
- Database data persists in a Docker volume named `postgres_data`
- Health checks ensure services start in the correct order
- All services are connected via the `erp-network` Docker network

