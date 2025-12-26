# Task Manager - CI/CD Pipeline

A Spring Boot Task Manager application with a production-grade CI/CD pipeline using GitHub Actions, Kubernetes (Kind), and ArgoCD GitOps.

## 🏗️ Architecture

```
Source (GitHub) → Build (Maven) → Test → CodeQL → Container (GHCR) → K8s Manifest Update → ArgoCD Sync → Kind Cluster
```

## 📁 Project Structure

```
task-manager/
├── .github/workflows/       # GitHub Actions CI/CD
│   └── ci.yml              # Main CI/CD pipeline
├── k8s/base/               # Kubernetes manifests
│   ├── kustomization.yaml  # Kustomize config
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── postgres-deployment.yaml
│   └── postgres-service.yaml
├── argocd/                 # ArgoCD configuration
│   └── application.yaml
├── scripts/                # Setup scripts
│   ├── setup-cluster.sh    # Linux/Mac
│   └── setup-cluster.ps1   # Windows
├── kind-config.yaml        # Kind cluster config
├── Dockerfile
├── docker-compose.yml
└── src/                    # Application source
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- GitHub account with repository access

### 1. Clone and Push to GitHub

```bash
git clone <this-repo>
cd task-manager
git remote set-url origin https://github.com/AaronCallanga/task-manager.git
git push -u origin main
```

### 2. Set Up Local Kind Cluster

**Windows (PowerShell):**
```powershell
.\scripts\setup-cluster.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-cluster.sh
./scripts/setup-cluster.sh
```

### 3. Create GHCR Pull Secret

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=AaronCallanga \
  --docker-password=YOUR_GITHUB_PAT \
  -n task-manager
```

### 4. Push Code to Trigger Pipeline

```bash
git add .
git commit -m "feat: initial CI/CD setup"
git push
```

## 🔗 Access Points

| Service | URL |
|---------|-----|
| Task Manager API | http://localhost:30080/api/tasks |
| ArgoCD UI | https://localhost:30081 |

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/{id} | Get task by ID |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |

## 🔧 CI/CD Pipeline Stages

1. **Build** - Compile with Maven
2. **Test** - Run unit tests
3. **CodeQL** - Security analysis
4. **Container** - Build & push to GHCR
5. **Update Manifest** - Update K8s image tag
6. **ArgoCD Sync** - Auto-deploy to cluster

## 📊 Local Development

```bash
# Run with Docker Compose
docker compose up -d

# Run tests
./mvnw test

# Build JAR
./mvnw package -DskipTests
```

## 🛠️ Useful Commands

```bash
# View pods
kubectl get pods -n task-manager

# View logs
kubectl logs -f deployment/task-manager -n task-manager

# View ArgoCD applications
kubectl get applications -n argocd

# Delete Kind cluster
kind delete cluster --name task-manager-cluster
```
