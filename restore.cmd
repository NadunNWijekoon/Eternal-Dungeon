@echo off
node scripts\restore_assets.js
node scripts\generate_beep.py
python scripts\generate_assets.py
echo DONE
