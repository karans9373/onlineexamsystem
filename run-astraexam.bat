@echo off
setlocal

cd /d "%~dp0"

set "PY310=C:\Users\mamta\AppData\Local\Programs\Python\Python310\python.exe"
set "SERVER_DIR=%~dp0server"
set "CLIENT_DIR=%~dp0client"

echo Starting AstraExam Pro...
echo.

if not exist "%SERVER_DIR%\.env" (
  if exist "%SERVER_DIR%\.env.example" copy /Y "%SERVER_DIR%\.env.example" "%SERVER_DIR%\.env" >nul
)

if not exist "%CLIENT_DIR%\.env" (
  if exist "%CLIENT_DIR%\.env.example" copy /Y "%CLIENT_DIR%\.env.example" "%CLIENT_DIR%\.env" >nul
)

if not exist "%PY310%" (
  echo Python 3.10 not found at:
  echo %PY310%
  echo.
  echo Install Python 3.10 or update this bat file with your Python path.
  pause
  exit /b 1
)

start "AstraExam Backend" cmd /k "cd /d ""%SERVER_DIR%"" && ""%PY310%"" run.py"
start "AstraExam Frontend" cmd /k "cd /d ""%CLIENT_DIR%"" && npm run dev"

echo Backend starting at  http://127.0.0.1:8000
echo Frontend starting at http://127.0.0.1:5173
echo.
echo If login or registration fails, wait 5-10 seconds for backend startup and refresh once.
echo Close the opened terminal windows to stop the website.
echo.

endlocal
