Write-Host "Testing Go build..." -ForegroundColor Green
try {
    go build -o test-server.exe ./cmd/server
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful!" -ForegroundColor Green
        Remove-Item test-server.exe -ErrorAction SilentlyContinue
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
    }
} catch {
    Write-Host "Go not found. Please install Go 1.22+ to test locally." -ForegroundColor Yellow
}
Read-Host "Press Enter to continue"
