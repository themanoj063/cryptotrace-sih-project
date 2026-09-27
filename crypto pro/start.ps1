Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Starting CryptoTrace Full-Stack Platform" -ForegroundColor Cyan
Write-Host "Frontend: React + Vite (http://localhost:3000)" -ForegroundColor Green
Write-Host "Backend: Node.js + Express (http://localhost:5000)" -ForegroundColor Blue
Write-Host "AI Service: Python ML Engine (http://localhost:5001)" -ForegroundColor Magenta
Write-Host "Database: MongoDB (mongodb://127.0.0.1:27017/cryptotrace)" -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/2] Checking MongoDB Database Health..." -ForegroundColor Yellow
node database/status.js
Write-Host ""
Write-Host "[2/2] Starting Services (AI, Backend, Frontend)..." -ForegroundColor Cyan
npm.cmd run dev
