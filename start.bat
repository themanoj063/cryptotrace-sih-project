@echo off
title CryptoTrace Platform Launcher
echo =========================================================
echo Starting CryptoTrace Full-Stack Platform
echo Frontend: React + Vite (http://localhost:3000)
echo Backend: Node.js + Express (http://localhost:5000)
echo AI Service: Python ML Engine (http://localhost:5001)
echo Database: MongoDB (mongodb://127.0.0.1:27017/cryptotrace)
echo =========================================================
echo.

echo [1/4] Verifying MongoDB Database Connection...
node database/status.js
echo.

echo [2/4] Starting AI Microservice, Backend, and Frontend...
start "CryptoTrace Python AI Service" cmd /k "node run-ai.js"
timeout /t 2 /nobreak >nul

start "CryptoTrace Node.js Backend" cmd /k "cd backend && npm.cmd run dev"
timeout /t 2 /nobreak >nul

start "CryptoTrace React Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo All services launched!
echo Open your browser at http://localhost:3000
pause
