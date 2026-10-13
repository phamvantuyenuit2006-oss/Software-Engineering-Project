@echo off
title VIETAI LIFE - Tro Ly AI Doi Song Nguoi Viet
echo ================================================================
echo           VIETAI LIFE - TRO LY DOI SONG NGUOI VIET              
echo ================================================================
echo Dang khoi dong may chu VietAI Life tai http://localhost:3000...
echo ================================================================

cd /d "%~dp0apps\web"

start http://localhost:3000
npm start
pause
