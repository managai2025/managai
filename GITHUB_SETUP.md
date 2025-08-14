# GitHub CI/CD Setup Guide

## 🔐 GitHub Repository Secrets

A GitHub repository-ban (`Settings` → `Secrets and variables` → `Actions`) add hozzá ezeket a secrets-eket:

### 1. `AWS_ROLE_ARN`
```
arn:aws:iam::<ACCOUNT_ID>:role/GitHubOIDCAppRunnerRole
```
Ez a role ARN, amit az AWS IAM-ben hoztál létre.

### 2. `APP_RUNNER_SERVICE_ARN`
```
arn:aws:apprunner:<REGION>:<ACCOUNT_ID>:service/<SERVICE_NAME>/<SERVICE_ID>
```
Ez az App Runner service ARN, amit az AWS Console-ban látsz.

## 🚀 AWS CloudShell Parancsok

### 1. OIDC Trust Role létrehozása

```bash
# VÁLTOZÓKAT ÍRD ÁT:
ACCOUNT_ID="<A_TE_AWS_ACCOUNT_IDD>"
REPO_FULL="managai2025/managai"   # github.com/<owner>/<repo>
ROLE_NAME="GitHubOIDCAppRunnerRole"
REGION="eu-central-1"

# Trust policy (GitHub OIDC)
cat > trust.json <<JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GitHubOidcTrust",
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        "StringLike": { "token.actions.githubusercontent.com:sub": "repo:${REPO_FULL}:ref:refs/heads/main" }
      }
    }
  ]
}
JSON

# Ha még nincs OIDC provider:
aws iam list-open-id-connect-providers | grep token.actions.github || \
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Szerep létrehozása
aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document file://trust.json

# Jogosultságok (egyszerű indulás: ECR + App Runner)
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AWSAppRunnerFullAccess
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

# Role ARN kiírás
aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text
```

### 2. ECR Repository létrehozása

```bash
aws ecr create-repository --repository-name managai --image-scanning-configuration scanOnPush=true --region "$REGION"
aws ecr describe-repositories --repository-names managai --region "$REGION" --query 'repositories[0].repositoryUri' --output text
```

### 3. App Runner Service létrehozása (első alkalommal)

```bash
# ECR image URI lekérése
ECR_URI=$(aws ecr describe-repositories --repository-names managai --region "$REGION" --query 'repositories[0].repositoryUri' --output text)

# App Runner service létrehozása
aws apprunner create-service \
  --service-name managai-service \
  --source-configuration "SourceConfiguration={ImageRepository={ImageIdentifier=$ECR_URI:latest,ImageRepositoryType=ECR,ImageConfiguration={Port=8080,StartCommand=/server}}}" \
  --region "$REGION"

# Service ARN lekérése
aws apprunner list-services --region "$REGION" --query 'ServiceSummaryList[?ServiceName==`managai-service`].ServiceArn' --output text
```

## 🔄 Automatikus Frissítés

Miután beállítottad a secrets-eket:

1. **Push a main branch-re** → automatikus build + deploy
2. **Manual trigger** → `Actions` → `Deploy to AWS App Runner` → `Run workflow`

## 📋 Ellenőrzés

### GitHub Actions
- `Actions` tab → workflow futás
- Build logok ellenőrzése

### AWS ECR
- ECR Console → `managai` repository
- Image tag-ek: `latest`, `commit-sha`

### AWS App Runner
- App Runner Console → `managai-service`
- Service status: `Running`
- Latest deployment: sikeres

## 🚨 Hibaelhárítás

### OIDC Trust Error
- Ellenőrizd a repository nevet a trust policy-ban
- OIDC provider létezik-e

### ECR Push Error
- Role jogosultságok rendben vannak-e
- ECR repository létezik-e

### App Runner Update Error
- Service ARN helyes-e
- Service fut-e
