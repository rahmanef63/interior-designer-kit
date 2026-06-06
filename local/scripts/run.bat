@echo off
REM Generic local runner. Usage: run.bat <task> "<input>" [--dry-run]
node "%~dp0..\runner\index.mjs" %*
