@echo off
setlocal
set "GIT_BASH=C:\Program Files\Git\bin\bash.exe"
if not exist "%GIT_BASH%" (
  echo Git Bash not found at "%GIT_BASH%"
  exit /b 1
)
"%GIT_BASH%" -lc %*
endlocal
