# VietAI Life - One-Click Local Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   VIETAI LIFE - DANG KHOI CHAY MOI TRUONG LOCAL       " -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Start Frontend Web App (Next.js 15)
Write-Host "[1/2] Khoi dong Frontend Web App (Next.js 15) tai http://localhost:3000..." -ForegroundColor Green
$webPath = Join-Path $PSScriptRoot "apps\web"
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$webPath`" && npm run dev"

# 2. Start Backend API (.NET 10)
Write-Host "[2/2] Khoi dong Backend API (.NET 10) tai http://localhost:5200..." -ForegroundColor Green
$apiDll = Join-Path $PSScriptRoot "services\api\src\API\bin\Debug\net10.0\VietAILife.API.dll"
$apiDir = Join-Path $PSScriptRoot "services\api\src\API"
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$apiDir`" && set ASPNETCORE_URLS=http://localhost:5200 && dotnet `"$apiDll`""

Start-Sleep -Seconds 4
Write-Host "`nHe thong da duoc khoi dong thanh cong!" -ForegroundColor Yellow
Write-Host "  -> Frontend Web App:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  -> Backend API Core:  http://localhost:5200" -ForegroundColor Cyan
Write-Host "`nDang mo trinh duyet Web..." -ForegroundColor Gray
Start-Process "http://localhost:3000"
