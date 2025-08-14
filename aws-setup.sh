#!/bin/bash

# ManagAI AWS Setup Script
# Futtasd ezt az AWS CloudShell-ben!

set -e

echo "🚀 ManagAI AWS Setup Script"
echo "============================"

# VÁLTOZÓKAT ÍRD ÁT:
ACCOUNT_ID="<A_TE_AWS_ACCOUNT_IDD>"
REPO_FULL="managai2025/managai"   # github.com/<owner>/<repo>
ROLE_NAME="GitHubOIDCAppRunnerRole"
REGION="eu-central-1"

echo "📋 Konfiguráció:"
echo "  Account ID: $ACCOUNT_ID"
echo "  Repository: $REPO_FULL"
echo "  Region: $REGION"
echo "  Role Name: $ROLE_NAME"
echo ""

read -p "Folytatod? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup megszakítva"
    exit 1
fi

echo "🔐 1. OIDC Provider létrehozása..."
if ! aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[?contains(Arn, `token.actions.githubusercontent.com`)].Arn' --output text | grep -q .; then
    echo "  OIDC provider létrehozása..."
    aws iam create-open-id-connect-provider \
        --url https://token.actions.githubusercontent.com \
        --client-id-list sts.amazonaws.com \
        --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
    echo "  ✅ OIDC provider létrehozva"
else
    echo "  ✅ OIDC provider már létezik"
fi

echo "🔄 2. Trust Policy létrehozása..."
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
echo "  ✅ Trust policy létrehozva"

echo "👤 3. IAM Role létrehozása..."
if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
    echo "  Role már létezik, frissítem a trust policy-t..."
    aws iam update-assume-role-policy --role-name "$ROLE_NAME" --policy-document file://trust.json
else
    echo "  Új role létrehozása..."
    aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document file://trust.json
fi

echo "🔑 4. Jogosultságok hozzáadása..."
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AWSAppRunnerFullAccess
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
echo "  ✅ Jogosultságok hozzáadva"

echo "📊 5. Role ARN lekérése..."
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text)
echo "  Role ARN: $ROLE_ARN"

echo "🐳 6. ECR Repository létrehozása..."
if aws ecr describe-repositories --repository-names managai --region "$REGION" >/dev/null 2>&1; then
    echo "  ECR repository már létezik"
else
    echo "  Új ECR repository létrehozása..."
    aws ecr create-repository --repository-name managai --image-scanning-configuration scanOnPush=true --region "$REGION"
fi

ECR_URI=$(aws ecr describe-repositories --repository-names managai --region "$REGION" --query 'repositories[0].repositoryUri' --output text)
echo "  ECR URI: $ECR_URI"

echo ""
echo "🎯 Setup kész! Következő lépések:"
echo ""
echo "1. GitHub Repository Secrets:"
echo "   AWS_ROLE_ARN: $ROLE_ARN"
echo "   APP_RUNNER_SERVICE_ARN: (ezt később állítsd be)"
echo ""
echo "2. App Runner Service létrehozása (AWS Console):"
echo "   - Create service → Container registry"
echo "   - Image URI: $ECR_URI:latest"
echo "   - Port: 8080"
echo "   - Health check: /healthz"
echo ""
echo "3. App Runner Service ARN beállítása GitHub secret-ként"
echo ""
echo "4. Push a main branch-re → automatikus deploy!"
echo ""

# Cleanup
rm -f trust.json

echo "🧹 Trust policy fájl törölve"
echo "✅ Setup script sikeresen lefutott!"
