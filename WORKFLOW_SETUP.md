# GitHub Actions Workflow Manuális Létrehozása

## ⚠️ Fontos

A GitHub Personal Access Token nem rendelkezik a `workflow` scope-tal, ezért a workflow fájlt manuálisan kell létrehozni.

## 📁 Workflow Fájl Létrehozása

### 1. GitHub Repository-ban
- Menj a `Actions` tab-ra
- Kattints a `set up a workflow yourself` link-re
- Válaszd ki a `Simple workflow` opciót

### 2. Fájl Neve
```
.github/workflows/deploy.yml
```

### 3. Tartalom
Másold be ezt a kódot:

```yaml
name: Deploy to AWS App Runner

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AWS_REGION: eu-central-1
  ECR_REPOSITORY: managai
  APP_RUNNER_SERVICE: managai-service

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
        echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

    - name: Deploy to App Runner
      run: |
        # Get the latest image URI
        IMAGE_URI="${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:latest"
        
        # Check if service exists
        if aws apprunner describe-service --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN }} --region ${{ env.AWS_REGION }} 2>/dev/null; then
          echo "Updating existing App Runner service..."
          aws apprunner update-service \
            --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN }} \
            --source-configuration "SourceConfiguration={ImageRepository={ImageIdentifier=$IMAGE_URI,ImageRepositoryType=ECR,ImageConfiguration={Port=8080,StartCommand=/server}}}"
        else
          echo "Creating new App Runner service..."
          # This would create a new service - you might want to do this manually first
          echo "Please create the App Runner service manually first, then set APP_RUNNER_SERVICE_ARN secret"
        fi

    - name: Wait for deployment
      run: |
        if [ -n "${{ secrets.APP_RUNNER_SERVICE_ARN }}" ]; then
          echo "Waiting for deployment to complete..."
          aws apprunner wait service-running \
            --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN }} \
            --region ${{ env.AWS_REGION }}
          echo "Deployment completed successfully!"
        fi
```

### 4. Commit
- Kattints a `Commit changes` gombra
- A workflow automatikusan elindul

## 🔄 Alternatív Megoldás

Ha nem szeretnéd manuálisan létrehozni, használhatod a GitHub CLI-t:

```bash
# GitHub CLI telepítése
gh auth login
gh repo clone managai2025/managai
cd managai

# Workflow fájl létrehozása
mkdir -p .github/workflows
# Másold be a fenti tartalmat deploy.yml fájlba

# Commit és push
git add .github/
git commit -m "Add GitHub Actions workflow"
git push origin main
```

## ✅ Ellenőrzés

A workflow sikeresen létrejött, ha:
- Az `Actions` tab-on megjelenik a `Deploy to AWS App Runner` workflow
- A workflow fut a push-nál
- Nincs hiba a build logokban

## 🚨 Hibaelhárítás

### Workflow nem fut
- Ellenőrizd a fájl nevét és helyét
- Ellenőrizd a YAML szintaxist
- Nézd meg a GitHub Actions logokat

### Permission Error
- Ellenőrizd a repository permissions-t
- A workflow fájl a `.github/workflows/` mappában kell legyen
