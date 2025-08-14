# ManagAI Go Server Deployment Guide

## Prerequisites
- AWS CLI configured
- Docker installed locally (for testing)
- Go 1.22+ installed locally (for development)

## Local Development

### Run the server locally:
```bash
go run cmd/server/main.go
```

### Test locally:
- http://localhost:8080/ - Main page with API documentation
- http://localhost:8080/healthz - Health check
- http://localhost:8080/api/debug/state - Debug state (empty initially)

### Test API endpoints:
```bash
# Simulate demo events
curl -X POST http://localhost:8080/api/demo/simulate

# Check state
curl http://localhost:8080/api/debug/state

# Dispatch messages (requires CRON_SECRET)
curl -X POST http://localhost:8080/api/cron/dispatch-messages \
  -H "Authorization: Bearer your-secret-here"
```

### Build and test Docker image:
```bash
docker build -t managai-server .
docker run -p 8080:8080 managai-server
```

## AWS App Runner Deployment

### Option 1: Container Registry (ECR)
1. Build and push to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag managai-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/managai-server:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/managai-server:latest
```

2. Create App Runner service:
   - Source: Container Registry
   - Container image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/managai-server:latest
   - Port: 8080
   - Health check path: /healthz

### Option 2: GitHub Source Build
1. Push code to GitHub
2. Create App Runner service:
   - Source: GitHub
   - Repository: your-repo
   - Branch: main
   - Port: 8080
   - Health check path: /healthz

## Environment Variables

### Required:
- `PORT`: Server port (default: 8080)

### Optional:
- `MANAGAI_ORG_ID`: Organization ID for events
- `CRON_SECRET`: Secret for cron job authorization

### App Runner Configuration:
- App Runner automatically sets `PORT=8080`
- Set `MANAGAI_ORG_ID` and `CRON_SECRET` in App Runner environment variables

## DNS Configuration

### Quick DNS setup:
1. Set `www.managai.hu` CNAME to your App Runner domain (*.awsapprunner.com)
2. Redirect `managai.hu` (apex) to `www.managai.hu`

### Later optimization:
- Use CloudFront for unified domain setup
- Configure SSL certificates

## API Testing After Deployment

### 1. Health Check:
```bash
curl https://your-app.awsapprunner.com/healthz
# Should return: ok
```

### 2. Demo Simulation:
```bash
curl -X POST https://your-app.awsapprunner.com/api/demo/simulate
# Should return: {"ok":true,"queued":2}
```

### 3. Check State:
```bash
curl https://your-app.awsapprunner.com/api/debug/state
# Should show events and queued messages
```

### 4. Dispatch Messages:
```bash
curl -X POST https://your-app.awsapprunner.com/api/cron/dispatch-messages \
  -H "Authorization: Bearer your-cron-secret"
# Should return: {"ok":true,"sent":2}
```

## Verification

After deployment:
1. Test health endpoint: `https://your-app.awsapprunner.com/healthz` → should return "ok"
2. Test main page: `https://your-app.awsapprunner.com/`
3. Test API endpoints with the examples above
4. Test DNS: `https://www.managai.hu/healthz` → should return "ok"

## Security Notes

- The `/api/cron/dispatch-messages` endpoint is protected by `CRON_SECRET`
- Set a strong, unique secret in App Runner environment variables
- Consider using AWS Secrets Manager for production deployments
