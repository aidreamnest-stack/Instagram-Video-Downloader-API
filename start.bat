@echo off
echo Starting Node.js server...
echo Current directory: %CD%
echo.
echo Running 'node index.js'...
node index.js
echo.
echo Server exited with code: %ERRORLEVEL%
pause
