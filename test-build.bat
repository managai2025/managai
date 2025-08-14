@echo off
echo Testing Go build...
go build -o test-server.exe ./cmd/server
if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    del test-server.exe
) else (
    echo Build failed!
)
pause
