# ManagAI (Go monolit, Hello)

## 🚀 CI/CD Pipeline

Ez a projekt automatikusan települ AWS App Runner-re minden push-nál a main branch-re.

### GitHub Actions Workflow
- **Automatikus build** minden push-nál
- **ECR push** Docker image
- **App Runner frissítés** új image-gel
- **OIDC authentication** (nincs API key!)

## 🛠️ Lokális fejlesztés

### Go szerver futtatása
```bash
go run ./cmd/server
```

### Docker build & test
```bash
docker build -t managai:dev .
docker run -p 8080:8080 -e CRON_SECRET=dev -e MANAGAI_ORG_ID=demo managai:dev
```

## 🌐 API Végpontok

- **`GET /healthz`** - Health check
- **`POST /api/demo/simulate`** - Demo események
- **`POST /api/cron/dispatch-messages`** - Üzenet küldés (védett)
- **`GET /api/debug/state`** - Debug állapot

## 📋 Telepítés

### 1. AWS Setup (egyszeri)
```bash
# AWS CloudShell-ben futtasd:
chmod +x aws-setup.sh
./aws-setup.sh
```

### 2. GitHub Secrets
- `AWS_ROLE_ARN`: AWS IAM role ARN
- `APP_RUNNER_SERVICE_ARN`: App Runner service ARN

### 3. Automatikus Deploy
- Push a main branch-re → automatikus deploy!
- Vagy manual trigger: Actions → Deploy to AWS App Runner

## 📚 Dokumentáció

- [**GITHUB_SETUP.md**](GITHUB_SETUP.md) - GitHub CI/CD beállítás
- [**DEPLOYMENT.md**](DEPLOYMENT.md) - Részletes telepítési útmutató
- [**aws-setup.sh**](aws-setup.sh) - AWS erőforrások létrehozása
