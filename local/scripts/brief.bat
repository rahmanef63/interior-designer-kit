@echo off
REM Turn discussion notes into a concise design brief (brief.md).
REM Usage: brief.bat "Klien mau ruang tamu japandi, budget 80jt, deadline 2 bulan..."
node "%~dp0..\runner\index.mjs" brief %*
