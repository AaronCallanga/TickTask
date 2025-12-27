# TickTask

A modern, full-stack task management application built with **React** (Frontend) and **Spring Boot** (Backend). This project demonstrates best practices in building production-ready web applications with CI/CD pipelines, Docker containerization, and Kubernetes deployment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Running with Docker](#running-with-docker)
- [API Reference](#api-reference)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Contributing](#contributing)

---

## Overview

TickTask is a task management application that allows users to:

- ✅ Create, read, update, and delete tasks
- 🏷️ Organize tasks by status (To Do, In Progress, Done)
- ⚡ Set priority levels (Low, Medium, High)
- 📅 Assign due dates
- 🔍 Filter and search tasks

The application is designed with a feature-based architecture for scalability and maintainability.

---

## Tech Stack

### Frontend (`ticktask-client/`)

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **TanStack Router** | Routing |
| **TanStack Query** | Server State Management |
| **Zustand** | Client State Management |
| **React Hook Form + Zod** | Form Handling & Validation |
| **Vitest** | Unit Testing |

### Backend (`ticktask-server/`)

| Technology | Purpose |
|------------|---------|
| **Java 21** | Runtime |
| **Spring Boot 3** | Application Framework |
| **Spring Data JPA** | Data Access |
| **PostgreSQL** | Database |
| **Lombok** | Boilerplate Reduction |
| **Maven** | Build Tool |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local Orchestration |
| **GitHub Actions** | CI/CD |
| **Kubernetes** | Container Orchestration |
| **ArgoCD** | GitOps Deployment |
| **Kustomize** | K8s Configuration Management |

---

## Project Structure

```
TickTask/
├── ticktask-client/          # React Frontend
│   ├── src/
│   │   ├── features/         # Feature-based modules
│   │   │   └── tasks/        # Tasks feature
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── services/
│   │   │       ├── types/
│   │   │       └── index.ts
│   │   ├── components/       # Shared UI components
│   │   ├── layouts/          # Layout components
│   │   ├── lib/              # Third-party facades
│   │   ├── routes/           # TanStack Router routes
│   │   └── test/             # Test setup
│   ├── Dockerfile
│   └── nginx.conf
├── ticktask-server/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/callanga/task_manager/
│   │       ├── config/       # Configuration classes
│   │       ├── controller/   # REST Controllers
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── entity/       # JPA Entities
│   │       ├── exception/    # Exception handling
│   │       ├── repository/   # Data repositories
│   │       └── service/      # Business logic
│   └── Dockerfile
├── devops/                   # DevOps configuration
│   ├── argocd/               # ArgoCD applications
│   ├── kustomize/            # Kubernetes manifests
│   └── scripts/              # Setup scripts
├── docker-compose.yml        # Local development
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 22+ (for frontend)
- **Java** 21+ (for backend)
- **Docker** & **Docker Compose** (for containerized development)
- **PostgreSQL** 16+ (or use Docker)

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TickTask.git
cd TickTask
```

#### 2. Start the Database

```bash
docker compose up db -d
```

#### 3. Start the Backend

```bash
cd ticktask-server
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

#### 4. Start the Frontend

```bash
cd ticktask-client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Running with Docker

Build and run the entire stack with Docker Compose:

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

To stop all services:

```bash
docker compose down
```

---

## API Reference

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks/{id}` | Get task by ID |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/{id}` | Update a task |
| `DELETE` | `/tasks/{id}` | Delete a task |

#### Request/Response Examples

**Create Task**

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive README",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31"
}
```

**Response**

```json
{
  "id": 1,
  "title": "Complete documentation",
  "description": "Write comprehensive README",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "createdAt": "2024-12-27T00:00:00Z",
  "updatedAt": "2024-12-27T00:00:00Z"
}
```

#### Enums

**Status Values:** `TODO`, `IN_PROGRESS`, `DONE`

**Priority Values:** `LOW`, `MEDIUM`, `HIGH`

---

## Testing

### Frontend Tests

```bash
cd ticktask-client

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

```bash
cd ticktask-server

# Run tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report
```

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

### Workflows

#### Server CI (`.github/workflows/server-ci.yml`)

Triggered on changes to `ticktask-server/**`:

1. **Build** - Compile and package with Maven
2. **Test** - Run unit and integration tests
3. **Code Quality** - Static analysis with CodeQL
4. **Container** - Build and push Docker image to GHCR
5. **Deploy** - Update Kubernetes manifests for ArgoCD

#### Client CI (`.github/workflows/client-ci.yml`)

Triggered on changes to `ticktask-client/**`:

1. **Lint** - ESLint code quality check
2. **Test** - Run Vitest unit tests
3. **Build** - TypeScript compilation and Vite build
4. **Container** - Build and push Docker image to GHCR

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (Kind, Minikube, or cloud provider)
- kubectl configured
- ArgoCD installed

### Deploy with ArgoCD

1. Apply the ArgoCD application:

```bash
kubectl apply -f devops/argocd/ticktask-app.yaml
```

2. ArgoCD will automatically sync and deploy the application.

### Manual Deployment

```bash
# Apply base manifests
kubectl apply -k devops/kustomize/base

# Or apply environment-specific overlay
kubectl apply -k devops/kustomize/overlays/dev
```

---

## Environment Variables

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `""` (uses proxy) |
| `VITE_APP_NAME` | Application name | `TickTask` |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/taskmanager` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://localhost:5173` |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the feature-based architecture for frontend code
- Write tests for new features
- Update documentation when adding new functionality
- Follow conventional commit messages

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TanStack](https://tanstack.com/) for React Query and Router
- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
