$ErrorActionPreference = "Stop"
$apiUrl = "http://127.0.0.1:5200"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   VIETAI LIFE - BAT DAU CHAY DEMO TEST TOAN HE THONG    " -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Khoi dong Backend API
Write-Host "[1/6] Dang khoi dong Backend API (.NET 10 Clean Architecture)..." -ForegroundColor Yellow
$process = Start-Process -FilePath "dotnet" `
    -ArgumentList "run --project C:\Users\Tuyen\OneDrive\Desktop\vietai-life\services\api\src\API\VietAILife.API.csproj --urls $apiUrl --UseInMemoryDatabase true" `
    -PassThru -NoNewWindow

# 2. Doi API san sang
Write-Host "[2/6] Dang kiem tra trang thai he thong qua endpoint /health..." -ForegroundColor Yellow
$isReady = $false
for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Seconds 1
    try {
        $healthResponse = Invoke-RestMethod -Uri "$apiUrl/health" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($healthResponse.status -eq "Healthy") {
            $isReady = $true
            break
        }
    } catch {
    }
}

if (-not $isReady) {
    Write-Host "Loi: Backend API khong khoi dong kip." -ForegroundColor Red
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "Backend API da san sang! (Status: $($healthResponse.status))`n" -ForegroundColor Green

try {
    # 3. Test Dang ky & Dang nhap
    Write-Host "[3/6] Kiem thu Xac thuc: Dang ky nguoi dung moi..." -ForegroundColor Yellow
    $registerPayload = @{
        email = "tuyen.demo@vietailife.vn"
        password = "VietAILife@SecurePassword2026!"
        fullName = "Pham Van Tuyen"
        occupation = "Ky su AI"
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "$apiUrl/api/v1/auth/register" `
        -Method Post `
        -Body $registerPayload `
        -ContentType "application/json; charset=utf-8"

    $token = $authResponse.accessToken
    Write-Host "Dang ky thanh cong: $($authResponse.user.email)" -ForegroundColor Green
    Write-Host "   - Ho ten: $($authResponse.user.fullName)" -ForegroundColor Gray
    Write-Host "   - Vai tro: $($authResponse.user.role)" -ForegroundColor Gray
    Write-Host "   - JWT Access Token: $($token.Substring(0, 35))... (Hop le)`n" -ForegroundColor Gray

    $headers = @{
        "Authorization" = "Bearer $token"
    }

    # 4. Test Chat AI & RAG & Trust Layer
    Write-Host "[4/6] Kiem thu Chat AI & RAG & Trust Layer..." -ForegroundColor Yellow
    $chatPayload = @{
        content = "Toi muon hoc tieng Anh B1 trong 3 thang de tot nghiep, hay tu van lo trinh"
        model = "vietai-standard-v1"
        enableRAG = $true
        enableMemory = $true
    } | ConvertTo-Json

    $chatResponse = Invoke-RestMethod -Uri "$apiUrl/api/v1/chat" `
        -Method Post `
        -Headers $headers `
        -Body $chatPayload `
        -ContentType "application/json; charset=utf-8"

    Write-Host "Nhan phan hoi tu VietAI Life:" -ForegroundColor Green
    Write-Host "   - Muc do nhan thuc (Trust Level): $($chatResponse.trustLevel)" -ForegroundColor Cyan
    Write-Host "   - So luong Token: $($chatResponse.tokenCount) tokens" -ForegroundColor Gray
    Write-Host "   - Trich dan nguon (Citations): $($chatResponse.citations.Count) nguon" -ForegroundColor Gray
    Write-Host "   - Noi dung tra loi:" -ForegroundColor White
    Write-Host "   $($chatResponse.content)`n" -ForegroundColor Gray

    # 5. Test AI Agent Studio
    Write-Host "[5/6] Kiem thu AI Agent Studio: Kich hoat Tac vu da buoc..." -ForegroundColor Yellow
    $agentPayload = @{
        goalTitle = "Hoc tieng Anh B1 trong 3 thang"
        goalDescription = "Xay dung thoi khoa bieu 12 tuan, chia nho muc tieu tu vung, ngu phap va tao bai tap luyen thi VSTEP."
        category = "Education"
    } | ConvertTo-Json

    $agentResponse = Invoke-RestMethod -Uri "$apiUrl/api/v1/agents/run" `
        -Method Post `
        -Headers $headers `
        -Body $agentPayload `
        -ContentType "application/json; charset=utf-8"

    Write-Host "Co may Agent hoan thanh tac vu:" -ForegroundColor Green
    Write-Host "   - Task ID: $($agentResponse.id)" -ForegroundColor Gray
    Write-Host "   - Trang thai: $($agentResponse.status)" -ForegroundColor Green
    Write-Host "   - So buoc thuc thi: $($agentResponse.steps.Count) buoc" -ForegroundColor Gray
    foreach ($step in $agentResponse.steps) {
        Write-Host "     * Buoc $($step.stepNumber): $($step.title) (Thoi gian: $($step.executionTimeMs) ms)" -ForegroundColor DarkGreen
        Write-Host "       Quan sat: $($step.observation)" -ForegroundColor DarkGray
    }
    Write-Host ""

    # 6. Test Admin Dashboard
    Write-Host "[6/6] Kiem thu Admin Dashboard: Giam sat Metric & Chi phi AI..." -ForegroundColor Yellow
    $stats = Invoke-RestMethod -Uri "$apiUrl/api/v1/admin/stats" -Method Get -Headers $headers

    Write-Host "Thong ke he thong thoi gian thuc:" -ForegroundColor Green
    Write-Host "   - Tong nguoi dung: $($stats.totalUsers) (DAU: $($stats.activeUsersToday))" -ForegroundColor Gray
    Write-Host "   - Tong hoi thoai: $($stats.totalConversations)" -ForegroundColor Gray
    Write-Host "   - Nhiem vu Agent hoan thanh: $($stats.totalAgentTasksCompleted)" -ForegroundColor Gray
    Write-Host "   - Tong Token tieu thu: $($stats.totalTokensUsed) tokens" -ForegroundColor Gray
    Write-Host "   - Chi phi uoc tinh: $($stats.estimatedAiCostVnd) VND (~`$$($stats.estimatedAiCostUsd))" -ForegroundColor Gray
    Write-Host "   - Do tre trung binh: $($stats.averageLatencyMs) ms" -ForegroundColor Gray
    Write-Host "   - Do tin cay he thong: $($stats.systemHealthPercent)%" -ForegroundColor Green

    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host "   TAT CA CAC BUOC TEST DEMO DEU THANH CONG 100%!       " -ForegroundColor Green
    Write-Host "========================================================`n" -ForegroundColor Cyan

} finally {
    Write-Host "Dang dung may chu test..." -ForegroundColor Gray
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
}
