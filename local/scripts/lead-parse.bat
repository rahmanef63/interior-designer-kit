@echo off
REM Parse a WhatsApp/Instagram lead message into structured JSON.
REM Usage: lead-parse.bat "Bu Sari, butuh desain cafe 80m2 budget 150jt di Bandung"
node "%~dp0..\runner\index.mjs" lead-parse %*
