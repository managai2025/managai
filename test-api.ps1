Write-Host "Testing ManagAI Go Server API..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080"

# Test health endpoint
Write-Host "`n1. Testing /healthz..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/healthz" -Method Get
    Write-Host "✅ Health check: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test main page
Write-Host "`n2. Testing main page..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "✅ Main page loaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Main page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test debug state (should be empty initially)
Write-Host "`n3. Testing /api/debug/state..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/debug/state" -Method Get
    Write-Host "✅ Debug state: $($response.events.Count) events, $($response.messages.Count) messages" -ForegroundColor Green
} catch {
    Write-Host "❌ Debug state failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test demo simulation
Write-Host "`n4. Testing /api/demo/simulate..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/demo/simulate" -Method Post
    Write-Host "✅ Demo simulation: $($response.queued) messages queued" -ForegroundColor Green
} catch {
    Write-Host "❌ Demo simulation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check state again after simulation
Write-Host "`n5. Checking state after simulation..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/debug/state" -Method Get
    Write-Host "✅ State after simulation: $($response.events.Count) events, $($response.messages.Count) messages" -ForegroundColor Green
    
    $queuedCount = ($response.messages | Where-Object { $_.status -eq "queued" }).Count
    Write-Host "   - Queued messages: $queuedCount" -ForegroundColor Cyan
} catch {
    Write-Host "❌ State check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test cron endpoint (without auth - should fail)
Write-Host "`n6. Testing /api/cron/dispatch-messages (without auth)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cron/dispatch-messages" -Method Post
    Write-Host "❌ Should have failed without auth" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected without auth: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`n🎯 API testing completed!" -ForegroundColor Green
Write-Host "To test with auth, set CRON_SECRET environment variable and use:" -ForegroundColor Cyan
Write-Host "curl -X POST $baseUrl/api/cron/dispatch-messages -H 'Authorization: Bearer your-secret'" -ForegroundColor White

Read-Host "`nPress Enter to continue"
